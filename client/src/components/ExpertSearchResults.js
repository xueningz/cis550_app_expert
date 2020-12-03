import React from 'react';
import { List, Button, Skeleton } from 'antd';
import { Constants } from './Constants';
import PageNavbar from './PageNavbar';

// var pageSize = 10;
// var currPage = 0;
// var term = "Android Apps";

export default class ExpertSearchResults extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        // 这个是此组件第一次渲染到网页上的回调
        // 可通过 this.props.query_term接收ExpertSearch传来的参数
        // do something, like setState
    }

    componentWillReceiveProps(nextProps) {
        // 这个是此组件已经显示在网页上了，只是props改变了，比如我用Expert Search搜出了结果，还在这个页面，又想搜新的内容
        // 可通过 nextProps.query_term接收ExpertSearch传来的新的参数
        // do something similar to what you do in componentDidMount()
    }

    render() {
        return (
            <div>
                <PageNavbar />
            </div>
        )
    }


/* 下面的是我的Bing Search result list的源码，可以实现分页load more的功能，可参考之 */
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         initLoading: true,
    //         loading: false,
    //         data: [],
    //         list: [],
    //     };
    // }

    // componentDidMount() {
    //     pageSize = this.props.maxNumOfRes;
    //     term = this.props.query_term;
    //     this.setState({
    //         initLoading: false,
    //         data: this.props.bing_res,
    //         list: this.props.bing_res
    //     })
    // }

    // componentDidUpdate(prevProps) {
    //     if (this.props.query_term != prevProps.query_term) {
    //         pageSize = this.props.maxNumOfRes;
    //         term = this.props.query_term;
    //         this.setState({
    //             initLoading: false,
    //             data: this.props.bing_res,
    //             list: this.props.bing_res
    //         })
    //     }
    // }

    // getData = callback => {
    //     fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(term)}&count=${pageSize}&offset=${currPage * pageSize}&setLang=en`, {
    //         method: 'GET',
    //         headers: {
    //             'Ocp-Apim-Subscription-Key': `${Constants.bing_api_key}`
    //         }
    //     })
    //         .then(res => res.json())
    //         .then(res => {
    //             callback(res.webPages.value)
    //         })
    //         .catch(err => console.log(err));
    // };

    // onLoadMore = () => {
    //     currPage++;
    //     this.setState({
    //         loading: true,
    //         list: this.state.data.concat([...new Array(pageSize)].map(() => ({ loading: true, name: "" }))),
    //     });
    //     this.getData(res => {
    //         const data = this.state.data.concat(res);
    //         this.setState(
    //             {
    //                 data,
    //                 list: data,
    //                 loading: false,
    //             },
    //             () => {
    //                 // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
    //                 // In real scene, you can using public method of react-virtualized:
    //                 // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
    //                 window.dispatchEvent(new Event('resize'));
    //             },
    //         );
    //     });
    // };

    // render() {
    //     const { initLoading, loading, list } = this.state;
    //     const loadMore =
    //         !initLoading && !loading ? (
    //             <div
    //                 style={{
    //                     textAlign: 'center',
    //                     marginTop: 12,
    //                     height: 32,
    //                     lineHeight: '32px',
    //                 }}
    //             >
    //                 <Button onClick={this.onLoadMore}>loading more</Button>
    //             </div>
    //         ) : null;

    //     return (
    //         <div>
    //             <PageNavbar />
    //             <div className="bing_result_page">
    //                 <List
    //                     className="bing_result_list"
    //                     loading={initLoading}
    //                     itemLayout="horizontal"
    //                     loadMore={loadMore}
    //                     dataSource={list}
    //                     renderItem={item => (
    //                         <List.Item>
    //                             <Skeleton title={false} loading={item.loading} active>
    //                                 <div>
    //                                     <h4><a href={item.url} target="_blank">{decodeURIComponent(item.name)}</a></h4>
    //                                     <p>{decodeURIComponent(item.snippet)}</p>
    //                                     <div><a href={item.url} target="_blank" className="bing_display_url">{item.displayUrl}</a></div>
    //                                 </div>
    //                             </Skeleton>
    //                         </List.Item>
    //                     )}
    //                 />
    //             </div>
    //         </div>
    //     );
    // }
}