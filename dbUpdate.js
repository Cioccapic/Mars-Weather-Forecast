
    
     let mysql = require('mysql')


    const https = require('https');
    

    https.get('https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0&api_key=gWOAagtqrWsc8pSfOKyjIppMZFZfqiD3phhomS4K', (resp) => {
      let data = '';
    
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      let json = '';
    
      // The whole response has been received. Print out the result.
       resp.on('end', () => {

          json = JSON.parse(data);
          
          // var dayData = 
          //   {

          //   day : 0, 
          //   tempMin : 0,
          //   dtempMax : 0,
          //   tempAvg : 0,
          //   tempSamples : 0,
          //   atmosMin : 0,
          //   atmosMax : 0,
          //   atmosAvg : 0,
          //   atmosSamples : 0,
          //   windMin : 0,
          //   windMax : 0,
          //   windAvg : 0,
          //   windSamples : 0,
          //   season : 0

          //   }

          let days = json.validity_checks.sols_checked;
          let indexSolString = '';
          let date = new Date();
          let year = date.getFullYear();

          for (let i = 0; i < days.length - 1; i++)
          {                    

            let con = mysql.createConnection({
              host: "",
              user: "",
              password: "",
              database: ""
            })
      
            con.connect(function(err){

              indexSolString = days[i].toString();
              let controlDays = '';

              if(err) throw err;

                let sql = "INSERT INTO Sol(sol, tempmin, tempmax, tempavg, tempsamples, "+
                  "atmospresmin, atmospresmax, atmospresavg, atmospressamples, windspeedmin, windspeedmax, windspeedavg, windspeedsamples, season, id) VALUES('" 
                + days[i] + "','" + json[indexSolString].AT.mn + "','" + json[indexSolString].AT.mx + "','" + json[indexSolString].AT.av + "','" + json[indexSolString].AT.ct + "','" +
                  json[indexSolString].PRE.mn + "','" + json[indexSolString].PRE.mx + "','" + json[indexSolString].PRE.av + "','" + json[indexSolString].PRE.ct + "','" +
                  json[indexSolString].HWS.mn + "','" + json[indexSolString].HWS.mx + "','" + json[indexSolString].HWS.av + "','" + json[indexSolString].HWS.ct + "','" +
                  json[indexSolString].Season + "','" + days[i] + "-" + year +"')";

                con.query(sql, function(err, result){
                    if(err) throw err;
                    console.log("update succesful");
                })
            })         
          }
       });

      
    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
