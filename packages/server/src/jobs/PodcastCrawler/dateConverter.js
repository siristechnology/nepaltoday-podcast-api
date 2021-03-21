const NepaliDate = require('nepali-date-converter')
const getNepaliMonthsInNepali = () => {
    return [
		['बैशाख'], 
		['जेठ'], 
		['अषाढ'], 
		['श्रावण'], 
		['भदौ'], 
		['आश्विन'], 
		['कार्तिक'], 
		['मंसिर'], 
		['पौष', 'पुष'], 
		['माघ'], 
		['फाल्गुन'], 
		['चैत्र']
	]
}

const getNepaliMonthNumber = (month) => {
	let index = null
	getNepaliMonthsInNepali().forEach((monthArr,i)=>{
		if(monthArr.includes(month)){
			index = i
		}
	})
    if(index==null){
        return null
    }else{
        return (index + 1)
    }
}

const convertArticleDateToAD = (article) => {
	try{
		const articleDate = article.createdDate
		let articleDateArr = articleDate.split(' ')
		articleDateArr = articleDateArr.filter(x=>x.length>0)
		articleDateArr = articleDateArr.slice(0,3)
		if(articleDateArr[2] && articleDateArr[2].length==4){
			let day = articleDateArr[0]
			let year = articleDateArr[2]
			articleDateArr[0] = year
			articleDateArr[2] = day
		}
		articleDateArr[1] = getNepaliMonthNumber(articleDateArr[1])
		let bsDate = articleDateArr.join('-')
		let englishBsDate = ''
		for(let i = 0; i < bsDate.length; i++){
			englishBsDate = englishBsDate + '' + convertToEnglishNumber(bsDate[i])
		}
		
		const dataObj = new NepaliDate(englishBsDate)
		article.createdDate = dataObj.toJsDate()
		article.modifiedDate = dataObj.toJsDate()
		article.publishedDate = dataObj.toJsDate()
		return article

	}catch{
		return article
	}
}


function convertToEnglishNumber(t) {
	switch (t) {
		case '०':
			return 0
		case '१':
			return 1
		case '२':
			return 2
		case '३':
			return 3
		case '४':
			return 4
		case '५':
			return 5
		case '६':
			return 6
		case '७':
			return 7
		case '८':
			return 8
		case '९':
			return 9
		case '0':
			return '0'
		case '1':
			return '1'
		case '2':
			return '2'
		case '3':
			return '3'
		case '4':
			return '4'
		case '5':
			return '5'
		case '6':
			return '6'
		case '7':
			return '7'
		case '8':
			return '8'
		case '9':
            return '9'
        case '-':
            return '-'
	}
}


module.exports = {
    convertArticleDateToAD
}