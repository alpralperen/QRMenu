// Use native fetch (REST API) instead of heavy Firebase SDK for instant load times
const PROJECT_ID = "qrmenu-app-da287";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Helper to parse Firestore REST response to normal JS object
const parseFirestoreDocument = (doc) => {
  if (!doc || !doc.fields) return null;
  const data = {};
  for (const [key, value] of Object.entries(doc.fields)) {
    if (value.stringValue !== undefined) data[key] = value.stringValue;
    else if (value.integerValue !== undefined) data[key] = parseInt(value.integerValue);
    else if (value.doubleValue !== undefined) data[key] = parseFloat(value.doubleValue);
    else if (value.booleanValue !== undefined) data[key] = value.booleanValue;
    else if (value.arrayValue !== undefined) {
      data[key] = (value.arrayValue.values || []).map(v => v.stringValue || v.integerValue);
    }
  }
  // Extract document ID from name
  data.id = doc.name.split('/').pop();
  return data;
};

// Fetch all products for a given cafe using REST API
export const getProducts = async (cafeId) => {
  try {
    const query = {
      structuredQuery: {
        from: [{ collectionId: 'Products' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'cafe_id' },
            op: 'EQUAL',
            value: { stringValue: cafeId }
          }
        }
      }
    };

    const response = await fetch(`${BASE_URL}:runQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    const result = await response.json();
    
    // :runQuery returns an array of objects like { document: {...} }
    const products = [];
    for (const item of result) {
      if (item.document) {
        products.push(parseFirestoreDocument(item.document));
      }
    }
    
    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    return [];
  }
};

// Create a new request (Garson or Hesap) using REST API
export const createRequest = async (cafeId, tableNumber, requestType, paymentMethod = null) => {
  try {
    const fields = {
      cafe_id: { stringValue: cafeId },
      table_number: { stringValue: tableNumber.toString() },
      request_type: { stringValue: requestType },
      status: { stringValue: 'bekliyor' },
      timestamp: { timestampValue: new Date().toISOString() }
    };

    if (paymentMethod) {
      fields.payment_method = { stringValue: paymentMethod };
    }

    const response = await fetch(`${BASE_URL}/Requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });

    if (!response.ok) throw new Error('Failed to create request');
    
    const result = await response.json();
    return result.name.split('/').pop(); // return id
  } catch (error) {
    console.error("Error adding request: ", error);
    throw error;
  }
};

// Fetch pending requests for Admin Panel
export const getRequests = async (cafeId) => {
  try {
    const query = {
      structuredQuery: {
        from: [{ collectionId: 'Requests' }],
        where: {
          compositeFilter: {
            op: 'AND',
            filters: [
              {
                fieldFilter: {
                  field: { fieldPath: 'cafe_id' },
                  op: 'EQUAL',
                  value: { stringValue: cafeId }
                }
              },
              {
                fieldFilter: {
                  field: { fieldPath: 'status' },
                  op: 'EQUAL',
                  value: { stringValue: 'bekliyor' }
                }
              }
            ]
          }
        },
        orderBy: [
          { field: { fieldPath: 'timestamp' }, direction: 'DESCENDING' }
        ]
      }
    };

    const response = await fetch(`${BASE_URL}:runQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      // Note: First time you run a composite index query, Firebase might require an index.
      // If it throws an index error, we can fallback to filtering in JS.
      console.warn('Query failed, falling back to basic fetch');
      // Fallback: Fetch all requests for cafeId and filter in JS
      return await getRequestsFallback(cafeId);
    }
    
    const result = await response.json();
    const requests = [];
    for (const item of result) {
      if (item.document) {
        requests.push(parseFirestoreDocument(item.document));
      }
    }
    return requests;
  } catch (error) {
    console.error("Error fetching requests: ", error);
    return await getRequestsFallback(cafeId);
  }
};

// Fallback if composite index is missing
const getRequestsFallback = async (cafeId) => {
  try {
    const query = {
      structuredQuery: {
        from: [{ collectionId: 'Requests' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'cafe_id' },
            op: 'EQUAL',
            value: { stringValue: cafeId }
          }
        }
      }
    };
    const response = await fetch(`${BASE_URL}:runQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });
    if (!response.ok) return [];
    const result = await response.json();
    const requests = [];
    for (const item of result) {
      if (item.document) {
        const doc = parseFirestoreDocument(item.document);
        if (doc.status === 'bekliyor') {
          requests.push(doc);
        }
      }
    }
    // Sort descending manually
    return requests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    return [];
  }
};

// Update request status (Mark as completed)
export const updateRequestStatus = async (requestId) => {
  try {
    // We use PATCH in REST API to update a field
    const response = await fetch(`${BASE_URL}/Requests/${requestId}?updateMask.fieldPaths=status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          status: { stringValue: 'tamamlandı' }
        }
      })
    });
    if (!response.ok) throw new Error('Failed to update request');
    return true;
  } catch (error) {
    console.error("Error updating request: ", error);
    throw error;
  }
};

