const defaultPagination = {
    limit: 5,
    offset: 0
}

export default httpClient => ({
    getAll: async ({ type, limit, offset } = defaultPagination) => {
        const query = { limit, offset }

        switch(type.toLowerCase()) {
            case 'todos':
                query.type = ''
                break
            case 'problemas':
                query.type = 'issue'
                break
            case 'ideias':
                query.type = 'idea'
                break
            case 'outros':
                query.type = 'other'
                break
        }

        // if(type) {
            
        //     query.type = type
        // }
        const response = await httpClient.get('/feedbacks', { params: query })

        return { data: response.data }
    },
    getSummary: async() => {
        const response = await httpClient.get('/feedbacks/summary')
        return { data: response.data }
    }
})