// Gibt ein neues Objekt mit nur den erlaubten Feldern zurück
module.exports = function filterFields(obj, allowedFields) {
  const filtered = {};
  allowedFields.forEach(f => {
    if (obj[f] !== undefined) filtered[f] = obj[f];
  });
  return filtered;
};
