import supreagent from 'superagent'
import CONFIG from '../config'

const URI = CONFIG.URI


const Service = {
    GetTodayImageInfo (id) {
        return supreagent
                .get(URI.BING + 'today')
                .set('Content-type', 'application/json')
                .query(id ? { d: id} : {})
    },
    GetBingImageList ({pageNo, pageSize}) {
        return supreagent
            .get(URI.BING + 'story-list')
            .query({pageNo, pageSize})
    }
}

export default Service

