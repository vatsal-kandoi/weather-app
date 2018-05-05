console.log('Starting');

const yargs=require('yargs');
const request=require('request');

const argv=yargs
.options({
  a:{
    demand:true,
    alias:'address',
    describe:'Address to fetch weather',
    string:true
  }
})
  .help()
  .alias('help','h')
  .argv;

//USING PROMISES
var getlatlong= function(address){
  return new Promise(function(resolve,reject){
    request({
    url:"https://maps.googleapis.com/maps/api/geocode/json",
    json: true,
    qs:{
      address:address,
      key:'AIzaSyDh-kZxkyrEEu6TnLPEVEk4E4b4qBZYwZs'
    }
  },function(err,status,body){
    if(err){
      reject('No network connection.');
    }
    else{
    if(body.status==="OK"){
    resolve({
      address:body.results[0].formatted_address,
      lat:body.results[0].geometry.location.lat,
      lng:body.results[0].geometry.location.lng
    })
  }}
})

  });
};

getlatlong(argv.address).then(function(object){
  return new Promise(function(resolve,reject){
    request({
          url:"https://api.darksky.net/forecast/4e13f621e2ffc1a91273f12cd036c81b/"+object.lat+","+object.lng,
          json:true
        },function(err,res,body){
          if(res.statusCode===200){
          resolve({address:object.address,
          latitde:body.latitude,
          longitude:body.latitude,
          timezone:body.timezone,
          summary:body.currently.summary,
          temperature:body.currently.temperature,
          humidity:body.currently.humidity,
          PrecipitationProbablity:body.currently.precipProbability});
        }
        else{
          reject('Error in loading data');
        }
  });
})
}).then(function(res){
  console.log(res);
},function(rej){
  console.log(rej);
})

//NORMAL METHOD

// request({
// url:"https://maps.googleapis.com/maps/api/geocode/json",
// json: true,
// qs:{
//   address:argv.address,
//   key:'AIzaSyDh-kZxkyrEEu6TnLPEVEk4E4b4qBZYwZs'
// }
// },function(err,status,body){
//   if(err){
//     console.log("Unable to connect to user server");
//   }
//   else if(body.status==="ZERO_RESULTS"){
//     console.log("Invalid address");
//   }
//   else if(body.status==="OK"){
//     console.log(body.results[0].formatted_address);
//     request({
//       url:"https://api.darksky.net/forecast/4e13f621e2ffc1a91273f12cd036c81b/"+body.results[0].geometry.location.lat+","+body.results[0].geometry.location.lng,
//       json:true
//     },function(err,res,body){
//       if(res.statusCode===200){
//       console.log({latitde:body.latitude,
//       longitude:body.latitude,
//       timezone:body.timezone,
//       summary:body.currently.summary,
//       temperature:body.currently.temperature,
//       humidity:body.currently.humidity,
//       PrecipitationProbablity:body.currently.precipProbability,
//       PrecipitationType:body.currently.precipType});
//     } else if(res.statusCode===404){
//       console.log("Unable to get weather for the given location");
//     } else{
//       console.log("Error in server")
//     }
//     });
//
//   }
//   else if(body.status.results.length>0){
//     console.log('More than one results.Be more specific')
//   }
//   else if(body.status==='INVALID_REQUEST'){
//     console.log('No address given');
//   }
// });
