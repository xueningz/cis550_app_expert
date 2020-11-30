var config = require('./db-config.js');
var mysql = require('mysql');
var gplay = require('google-play-scraper');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Login validate ---- */

function loginCheck(req, res) {
  console.log('call routes loginCheck');
  var url = require('url');
  console.log(encodeURI(req.url));
  var parseObj = url.parse(req.url, true);
  console.log(parseObj);

  req.query = parseObj.query;

  var query = `
    SELECT *
    FROM user
    WHERE email = '${req.query.email}' AND password = '${req.query.password}'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      var num = rows.length;
      if (num === 0) {
        console.log("No such user, goto login failed page");
        res.redirect(301, 'http://localhost:3000/loginfailed');
      } else {
        console.log("We have this user!");
        res.writeHead(302, {
          'Set-Cookie': [
            "isVisit=1",
            "email=" + rows[0].email,
            "first_name=" + rows[0].first_name,
            "last_name=" + rows[0].last_name,
            "date=" + ((new Date()).getFullYear()) + "/" + ((new Date()).getMonth() + 1) + "/" + (new Date()).getDate()
          ],
          'Content-Type': 'text/plain',
          'Location': 'http://localhost:3000/home'
          
        });
        res.end();
        console.log(rows);
      }
    }
  });
};

/* ---- change password ---- */
function changePassword(req, res) {
  console.log('call routes changePassword');
  var url = require('url');
  console.log(encodeURI(req.url));
  var parseObj = url.parse(req.url, true);
  console.log(parseObj);

  req.query = parseObj.query;

  var query = `
    update user 
    set password='${req.query.password}' 
    where email='${req.query.email}'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      var num = rows.affectedRows;
      if (num === 0) {
        console.log("Change password failed - no such user");
        res.redirect(301, 'http://localhost:3000/resetpasswordfailed');
      } else {
        console.log("Change password OK");
        res.writeHead(302, {
          'Content-Type': 'text/plain',
          'Location': 'http://localhost:3000/loginreenter'
        });
        res.end();
        console.log(rows);
      }
    }
  });
};

/* ---- register validate ---- */
function register(req, res) {
  console.log('call routes register');
  var url = require('url');
  console.log(encodeURI(req.url));
  var parseObj = url.parse(req.url, true);
  console.log(parseObj);

  req.query = parseObj.query;

  var query = `
  insert into user
  values (
    '${req.query.email}', 
    '${req.query.password}', 
    '${req.query.firstName}', 
    '${req.query.lastName}'
  )
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      // console.log(err);
      console.log("Register failed - already exist this user");
      res.redirect(301, 'http://localhost:3000/registerfailed');
    } else {

      console.log("Register OK");
      res.writeHead(302, {
        'Content-Type': 'text/plain',
        'Location': 'http://localhost:3000/loginreenter'
      });
      res.end();
      console.log(rows);
      
    }
  });
};


/* ---- Q1a (Dashboard) ---- */
function getAllGenres(req, res) {
  console.log('call routes getAllGenres');
  var query = `
    SELECT DISTINCT Category AS genre
    FROM app_detail;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log(rows);
    }
  });
};


/* ---- Q1b (Dashboard) ---- */
function getTopInGenre(req, res) {
  console.log('call routes getTopInGenre');
  var genre = req.params.genre;
  console.log(genre)
  var query = `
    SELECT p.app_name, a.rating, a.installs, p.icon, p.summary, a.price 
    FROM package_info p JOIN app_detail a ON p.app_name = a.app_name
    WHERE a.Category = '${genre}' 
    ORDER BY a.rating DESC, a.installs DESC
    LIMIT 10;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log(rows);
    }
  });
};

/* ---- Q2 (Recommendations) ---- */
function getRecs(req, res) {
  console.log('call routes getRecs');
  var appName = req.params.appName;
  console.log(appName)
  var query = `
  SELECT p.app_name, a.rating, a.installs, p.icon, p.summary, a.price 
  FROM package_info p JOIN app_detail a ON p.app_name = a.app_name
  WHERE a.app_name LIKE '%${appName}%' 
  ORDER BY a.installs DESC, a.rating DESC;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log(rows);
    }
  });
};

/* ---- (Best Genres) ---- */
function getDecades(req, res) {
  var query = `
    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
    FROM (
      SELECT DISTINCT release_year as year
      FROM Movies
      ORDER BY release_year
    ) 
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Q3 (Best Genres) ---- */
function bestGenresPerDecade(req, res) {

};


/* Used for app detail page */

function getAppDetailByName(req, res) {
  var query = `SELECT * FROM app_detail a NATURAL JOIN package_info p WHERE a.app_name = "${req.params.app_name}";`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
}

function getAppScreenshotsById(req, res) {
  gplay.app({ appId: `${req.params.package_name}` })
    .then(queryResult => {
      if (queryResult) {
        res.json(queryResult.screenshots);
      } else {
        console.log("Cannot find the screenshots");
      }
    });
}

function getAppDescriptionById(req, res) {
  gplay.app({ appId: `${req.params.package_name}` })
    .then(queryResult => {
      if (queryResult) {
        res.json(queryResult.descriptionHTML);
      } else {
        console.log("Cannot find the description");
      }
    });
}

function loadMoreCommentsByAppName(req, res) {
  var query =
    `SELECT review_content, sentiment FROM app_review WHERE app_name = "${req.query.app_name}" 
    LIMIT ${(req.query.curr_page - 1) * req.query.page_size},${req.query.page_size};`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
}



function get10Apps(req, res) {
  console.log("Into get10Apps function");
  var query = `SELECT * FROM app_detail LIMIT 10;`;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("query result: ", rows);
      res.json(rows);
      console.log(rows);
    }
  });
}

function addToWishList(req, res) {
  console.log("Into addToWishList function");
  console.log("appName: ", req.query.appName);
  console.log("email: ", req.query.email);
  var query = `SELECT * FROM wishlist WHERE email='${req.query.email}' AND app_name='${req.query.appName}';`;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      if (rows.length == 0) {
        console.log("Wishlist does not have this, insert it.");
        query = `INSERT INTO wishlist (email, app_name) VALUES ('${req.query.email}', '${req.query.appName}');`;
      } else {
        console.log("Wishlist already has this, delete it.");
        query = `DELETE FROM wishlist WHERE email='${req.query.email}' AND app_name='${req.query.appName}';`;
      }
      connection.query(query, function(err, rows, fields) {
        if (err) {
          console.log(err);
        } else {
          res.json(rows);
          console.log("addToWishList query result: ", rows);
        }
      });
    }
  });
}

function isInWishList(req, res) {
  console.log("Into isInWishList function");
  console.log("appName: ", req.query.appName);
  console.log("email: ", req.query.email);
  var query = `SELECT * FROM wishlist WHERE email='${req.query.email}' AND app_name='${req.query.appName}';`;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("isInWishList query result: ", rows);
      res.json(rows);
    }
  });
}

function getWishList(req, res) {
  console.log("Into getWishList function");
  var query = `
    WITH wishApp AS (
      SELECT app_name
      FROM wishlist
      WHERE email='${req.params.email}'
    )
    SELECT *
    FROM wishApp w JOIN package_info p ON w.app_name=p.app_name JOIN app_detail d ON w.app_name=d.app_name JOIN has_genre g ON w.app_name=g.app_name
    ORDER BY w.app_name;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("getWishList query result: ", rows);
      res.json(rows);
    }
  });
}

function clearWishList(req, res) {
  console.log("Into clearWishList function");
  console.log("email: ", req.params.email);
  var query = `DELETE FROM wishlist WHERE email='${req.params.email}';`;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("clearWishList query result: ", rows);
      res.json(rows);
    }
  });
}

function getRecommended(req, res) {
  console.log("Into getRecommended function");
  var query = `
    WITH popGenre AS (
      SELECT genre, COUNT(g.app_name) AS num
      FROM has_genre g JOIN wishlist w ON g.app_name=w.app_name
      WHERE w.email='${req.params.email}'
      GROUP BY genre
      ORDER BY num DESC
      LIMIT 1
    ), popGenreApp AS (
      SELECT p.genre, app_name
      FROM popGenre p JOIN has_genre g ON p.genre=g.genre
			WHERE app_name NOT IN (
				SELECT app_name
				FROM wishlist
				WHERE email='${req.params.email}'
			)
    ), fourStarApp AS (
      SELECT *
      FROM app_detail
      WHERE rating>=4
    )
    SELECT *
    FROM popGenreApp g JOIN fourStarApp f ON g.app_name=f.app_name JOIN package_info i ON f.app_name=i.app_name
    ORDER BY f.installs DESC, f.rating DESC
    LIMIT 10;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("getRecommended query result: ", rows);
      res.json(rows);
    }
  });
}


function getFriends(req, res) {
  console.log("Into getFriends function");
  console.log(req.params.email);
  var query = `
  select first_name, last_name from 
  (select friend2 from friends where friend1='${req.params.email}') t left join user on friend2=email
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("getFriends query result: ", rows);
      res.json(rows);
    }
  });
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  loginCheck: loginCheck,
  changePassword: changePassword,
  register: register,
  getAllGenres: getAllGenres,
  getTopInGenre: getTopInGenre,
  getRecs: getRecs,
  getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade,
  getAppDetailByName: getAppDetailByName,
  getAppScreenshotsById: getAppScreenshotsById,
  getAppDescriptionById:getAppDescriptionById,
  loadMoreCommentsByAppName: loadMoreCommentsByAppName,
  get10Apps: get10Apps,
  addToWishList: addToWishList,
  getWishList: getWishList,
  isInWishList: isInWishList,
  clearWishList: clearWishList,
  getRecommended: getRecommended,
  getFriends: getFriends
}