import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import DashboardMovieRow from './DashboardMovieRow';
import AppDetail from './AppDetail';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
// import { Switch } from 'antd';
import '../style/WishList.css';
import { Rate } from 'antd';
import { getCookie } from './Home';





export default class Recommended extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      tenApps: [],
      wishList: [],
      userName: getCookie("first_name") + " " + getCookie("last_name"), // e.g. Zimao Wang
      email: getCookie("email"), // e.g. "zimaow@gmail.com",
      rcmdList: []
      // wishList: new Set(), // store divs for wishlist
      // wishListNames: new Set() // divs in wishList cannot check duplicates, use wishListNames to check
    }

    // this.addToWL = this.addToWL.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    console.log("into Recommended.js Mount");
    // Send an HTTP request to the server to get 10 apps to test.
    fetch("http://localhost:8081/getFriends/" + getCookie("email"), {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(tenAppList => {
        if (!tenAppList) return;
        // Map each tenAppObj in tenAppList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let tenAppDivs = tenAppList.map((tenAppObj, i) =>
           <GenreButton id={"button-" + tenAppObj.app_name} onClick={() => this.addToWishList(tenAppObj.app_name, this.state.email)} genre={tenAppObj.app_name} />

        );
        console.log("tenAppDivs: " + tenAppDivs);
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          tenApps: tenAppDivs
        });
        console.log("state's tenApps: " + this.state.tenApps);
      })
      .catch(err => console.log(err));	// Print the error if there is one.

    // send an HTTP request to the server to fetch wishlist
    // this.getWishList(this.state.email);
    this.getRecommended(this.state.email);
  }

  getWishList(email) {
    fetch("http://localhost:8081/getWishlist/"+email, {
    method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(wishList => {
        if (!wishList) return;
        // Map each tenAppObj in tenAppList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let wishDivs = wishList.map((wishObj, i) =>
          <tr>
            <td>
                <div class="product-item">
                    <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(wishObj.app_name)}><img src={wishObj.icon} alt="Product"></img></a>
                    <div class="product-info">
                        <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(wishObj.app_name)}>{wishObj.app_name}</a></h4>
                        ReactDOM.render(<Rate disabled defaultValue={0} value={wishObj.rating} />, mountNode);
                        <div class="text-lg text-medium text-muted">${wishObj.price}</div>
                        <div class="text-lg text-medium">{wishObj.summary}</div>
                    </div>
                </div>
            </td>
            <td class="text-center"><a class="remove-from-cart" href="" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
        </tr>
        );
        console.log("wishDivs: " + wishDivs);
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          wishList: wishDivs
        });
        console.log("state's wishList: " + this.state.wishList);
      })
      .catch(err => console.log(err));	// Print the error if there is one.
  }


  /* ---- Q1b (Dashboard) ---- */
  /* Set this.state.movies to a list of <DashboardMovieRow />'s. */

  addToWishList(appName, email) {
    fetch("http://localhost:8081/addToWishList?appName="+appName+"&email="+email, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(oneAppList => {
        // reload wishlist
        this.getWishList(email);
        this.getRecommended(email);
      })
      .catch(err => console.log(err))	// Print the error if there is one.
  }

  // clearWishList(email) {
  //   console.log("call clearWishList");
  //   console.log("clearWishList email: ", email);
  //   fetch("http://localhost:8081/clearWishlist/"+email, {
  //     method: 'GET' // The type of HTTP request.
  //   })
  //     .then(res => res.json()) // Convert the response data to a JSON.
  //     .then(oneAppList => {
  //       // reload wishlist
  //       this.getWishList(email);
  //     })
  //     .catch(err => console.log(err))	// Print the error if there is one.
  // }

  getRecommended(email) {
    console.log("call getRecommended");
    fetch("http://localhost:8081/getFriends/"+email, {
    method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(rcmdList => {
        if (!rcmdList) return;
        // Map each tenAppObj in tenAppList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let rcmdDivs = rcmdList.map((rcmdObj, i) =>
          <tr>
            <td>
                <div class="product-item">
                    {/* <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(rcmdObj.app_name)}><img src={rcmdObj.icon} alt="Product"></img></a> */}
                    <div class="product-info">
                        <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(rcmdObj.app_name)}>{rcmdObj.app_name}</a></h4>
                        <div><Rate disabled defaultValue={0} value={rcmdObj.rating} />&nbsp;{rcmdObj.rating}</div>
                        <div>{rcmdObj.installs}+ installs</div>
                        <div class="text-lg text-medium text-muted">${rcmdObj.price}</div>
                        <div class="text-lg text-medium">{rcmdObj.summary}</div>
                    </div>
                </div>
            </td>
            <td class="text-center"><a class="remove-from-cart" href="" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
        </tr>
        );
        console.log("rcmdDivs: " + rcmdDivs);
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          rcmdList: rcmdDivs
        });
        console.log("state's rcmdList: " + this.state.rcmdList);
      })
      .catch(err => console.log(err));	// Print the error if there is one.
  }
  

  render() {    
    return (
      
      // template: https://www.bootdey.com/snippets/view/Wishlist-profile#html
     <div> 
       <PageNavbar active="Friends" />
      <div class="container padding-bottom-3x mb-2">
        <div className="container movies-container">

        </div>
        <div class="row">
          <div class="col-lg-4">
            <aside class="user-info-wrapper">
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
                <a class="list-group-item" href="#"><i class="fa fa-user"></i>Profile</a>
                <a class="list-group-item" href="/wishlist"><i class="fa fa-heart"></i>Wishlist<span class="badge badge-primary badge-pill">{this.state.wishList.length}</span></a>
                <a class="list-group-item with-badge active" href="/recommended"><i class="fa fa-puzzle-piece"></i>Recommended</a>
            </nav>
          </div>
          <div class="col-lg-8">
            <div class="padding-top-2x mt-2 hidden-lg-up"></div>
            <div class="table-responsive wishlist-table margin-bottom-none">
              <table class="table">
                <thead>
                    <tr>
                        <th>My Friends</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.rcmdList}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}