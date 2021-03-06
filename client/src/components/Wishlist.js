import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import '../style/WishList.css';
import 'font-awesome/css/font-awesome.min.css';
import { Rate, Tag } from 'antd';
import { getCookie } from './Home';
import { Constants } from './Constants';





export default class Wishlist extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      tenApps: [],
      wishList: [],
      userName: getCookie("first_name") + " " + getCookie("last_name"), // e.g. Zimao Wang
      email: getCookie("email"), // e.g. "zimaow@gmail.com",
      // wishList: new Set(), // store divs for wishlist
      // wishListNames: new Set() // divs in wishList cannot check duplicates, use wishListNames to check
      tmpName: ""
    }

    // this.addToWL = this.addToWL.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    console.log("into Wishlist.js Mount");
    // send an HTTP request to the server to fetch wishlist
    this.getWishList(this.state.email);
  }

  getWishList(email) {
    fetch(`${Constants.servaddr_prefix}/getWishlist/`+email, {
    method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(wishList => {
        if (!wishList) return;
        // Map each tenAppObj in tenAppList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let wishDivs = wishList.map((wishObj, i) => {
          this.setState({
            tmpName: wishObj.app_name
          });
          console.log("tmpName: ", this.state.tmpName);
          let resultPrice = "";
          if (wishObj.price == 0) {
            resultPrice = <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;Free&nbsp;&nbsp;</div>;
          } else {
            resultPrice = <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;${wishObj.price}&nbsp;&nbsp;</div>;
          }
          let resultGenre = "";
          if (!wishObj.genre2) {
            resultGenre = <div class="tag-inline-block"><Tag color="cyan">{wishObj.genre1}</Tag></div>
          } else {
            resultGenre = <div class="tag-inline-block"><div class="tag-inline-block"><Tag color="cyan">{wishObj.genre1}</Tag></div><div class="tag-inline-block"><Tag color="cyan">{wishObj.genre2}</Tag></div></div>
          }
          // let resultButton = <div id={wishObj.app_name}><Switch id={wishObj.app_name} checkedChildren="pick" defaultChecked onClick={() => this.addToWishList(wishObj.app_name, this.state.email)} /></div> ;
          return (
            <tr>
              <td>
                  <div class="product-item">
                      <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(wishObj.app_name)}><img src={wishObj.icon} alt="Product"></img></a>
                      <div class="product-info">
                          <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(wishObj.app_name)}>{wishObj.app_name}</a></h4>
                          <div class="divs-inline"><Rate disabled defaultValue={0} value={wishObj.rating} />&nbsp;&nbsp;&nbsp;{wishObj.rating}</div>
                          &nbsp;&nbsp;{resultPrice}&nbsp;&nbsp;
                          {resultGenre}
                          <div>{wishObj.installs}+ installs</div>
                          <div dangerouslySetInnerHTML={{__html: wishObj.summary}}></div>
                      </div>
                  </div>
              </td>
              <td class="text-center">
                <a class="remove-from-cart" data-toggle="tooltip" title="" data-original-title="Remove item">
                  <i class="fa fa-window-close fa-2x remove-from-cart" aria-hidden="true" onClick={() => this.addToWishList(wishObj.app_name, this.state.email)}></i>
                </a>
              </td>
            </tr>
          )
        });
        console.log("wishDivs: ", wishDivs);
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          wishList: wishDivs
        });
        console.log("state's wishList: ", this.state.wishList);
      })
      .catch(err => console.log(err));	// Print the error if there is one.
  }



  addToWishList(appName, email) {
    console.log("call addToWishList");
    fetch(`${Constants.servaddr_prefix}/addToWishList?appName=`+encodeURIComponent(appName)+"&email="+email, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(oneAppList => {
        // reload wishlist
        this.getWishList(email);
      })
      .catch(err => console.log(err))	// Print the error if there is one.
  }

  clearWishList(email) {
    console.log("call clearWishList");
    console.log("clearWishList email: ", email);
    fetch(`${Constants.servaddr_prefix}/clearWishlist/`+email, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(oneAppList => {
        // reload wishlist
        this.getWishList(email);
      })
      .catch(err => console.log(err))	// Print the error if there is one.
  }

  

  render() {    
    return (
      
      // template: https://www.bootdey.com/snippets/view/Wishlist-profile#html
      <div> 
        <PageNavbar active="My Wishlist" />
        <br></br><p></p>
        <div class="container padding-bottom-3x mb-2">
          {/* <div className="container movies-container">
            <div className="jumbotron">
              <div className="h5">Test: some Apps to be added to wishlilst</div>
              <div className="genres-container">
                {this.state.tenApps}
              </div>
            </div>
          </div> */}
          <div class="row">
            <div class="col-lg-4">
              <aside class="user-info-wrapper">
                {/* <div class="user-cover" style={{backgroundImage: 'url(https://bootdey.com/img/Content/bg1.jpg)'}}></div> */}
                <div class="user-cover" style={{backgroundImage: 'url(https://source.unsplash.com/random)'}}></div>
                <div class="user-info">
                  <div class="user-avatar">
                    <a class="edit-avatar" href="#"></a><img src="../user-profile-pic1.png" alt="User"></img>
                  </div>
                  <div class="user-data">
                    <h4>{this.state.userName}</h4><span>Last Login on {getCookie("date")}</span>
                  </div>
                </div>
              </aside>
              <nav class="list-group">
              <a class="list-group-item" href="/following"> <i class="fa fa-user"> </i> Following</a>
                  <a class="list-group-item with-badge active" href="/wishlist"><i class="fa fa-heart"></i>My Wishlist<span class="badge badge-primary badge-pill">{this.state.wishList.length}</span></a>
                  <a class="list-group-item" href="/recommended"><i class="fa fa-puzzle-piece"></i>Recommendations</a>
              </nav>
            </div>
            <div class="col-lg-8">
              <div class="padding-top-2x mt-2 hidden-lg-up"></div>
              <div class="table-responsive wishlist-table margin-bottom-none">
              {/* <div className="user_actions block"><AddToWishlistButton app_name="Facebook" email='zimaow@gmail.com' /></div> */}
                <table class="table">
                  <thead>
                      <tr>
                          <th>Item Name</th>
                          <th class="text-center">
                            <a class="btn btn-sm btn-outline-danger" href="#" onClick={() => this.clearWishList(this.state.email)}><b>Empty</b></a>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    {/* <tr><td><div className="user_actions"><AddToWishlistButton app_name={this.state.tmpName} email={getCookie("email")} /></div></td></tr> */}
                  
                      {this.state.wishList}
                  </tbody>
                </table>
              </div>
              {/* <hr class="mb-4"> */}
              {/* <div class="custom-control custom-checkbox">
                  <input class="custom-control-input" type="checkbox" id="inform_me" checked=""></input>
                  <label class="custom-control-label" for="inform_me">Inform me when item from my wishlist is on sale</label>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}