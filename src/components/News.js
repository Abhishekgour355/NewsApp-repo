import React, {useEffect, useState} from 'react'
import Newsitem from '../Newsitem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props)=>{
   const [articles, setArticles] = useState([]);
   const [loading, setLoading] = useState(true);
   const [page, setPage] = useState(1);
   const [totalResults, setTotalResults] = useState(0);
  //  document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;

const capitalizeFirstLetter = (string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
   }

const updateNews = async()=>{
  props.setProgress(10);
  const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=d470c14f499c41b2b6adaa2284115ff2&page=${page}&pageSize=${props.pageSize}`;
  setLoading(true)
  let data = await fetch(url);
   props.setProgress(30);
  let parseData = await data.json();
  console.log(parseData.articles.length);
   props.setProgress(50);
   setArticles(parseData.articles);
   setTotalResults(parseData.totalResults);
   setLoading(false);
    props.setProgress(100);
}

useEffect(() => {
   updateNews();
   // eslint-disable-next-line
}, [])

const handlePrevClick = async()=>{    
 setPage(page-1)
 updateNews();
}
const handleNextClick =  async()=>{    
  setPage(page+1)
  updateNews(); 
   }

const  fetchMoreData = async() => {
  const nextPage = page+1;
   setPage(nextPage)
   setLoading(true)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=d470c14f499c41b2b6adaa2284115ff2&page=${nextPage+1}&pageSize=${props.pageSize}`;
  let data = await fetch(url);
  let parseData = await data.json();
  setArticles(articles.concat(parseData.articles))
  setTotalResults(parseData.totalResults)
  setLoading(false)
   }

    return (
      <>
        <h1 className="text-center" style={{margin: '35px 0px', marginTop:'90px'}}>NewsMonkey - Top  {capitalizeFirstLetter(props.category)} Headlines</h1>
        {loading && <Spinner/>}
      <InfiniteScroll
       dataLength={articles.length} 
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner/>}
        >
          <div className="container">
          
        <div className="row">
        {articles.map((element)=>{
        return <div className="col-md-4" key={element.url}>
        <Newsitem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl = {element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
        </div>
        })
      }
        </div>
          
          </div>
          
         </InfiniteScroll>
      </>
        
    )
}



News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
  }
  
  News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }
export default News
