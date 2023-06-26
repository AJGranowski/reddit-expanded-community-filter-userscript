interface Edge {
    node: {
        name: string
    }
}

interface MutedSubredditsResponse {
    data: {
        identity: {
            mutedSubreddits: {
                edges: Edge[]
            }
        }
    }
}

export { MutedSubredditsResponse };