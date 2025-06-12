module.exports = function filterFields(dataArray, allowedFields) {
    return dataArray.map(obj => {
        const filtered = {}
        for (const key of allowedFields) {
            if (obj[key] !== undefined) {
                filtered[key] = obj[key]
            }
        }
        return filtered
    })
}
