function str_repeat(a,b){for(var c=[];b>0;c[--b]=a);return c.join("")}function sprintf(){var a=0,b,c=arguments[a++],d=[],e,f,g,h,i="";while(c){if(e=/^[^\x25]+/.exec(c))d.push(e[0]);else if(e=/^\x25{2}/.exec(c))d.push("%");else{if(!(e=/^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(c)))throw"Huh ?!";if((b=arguments[e[1]||a++])==null||b==undefined)throw"Too few arguments.";if(/[^s]/.test(e[7])&&typeof b!="number")throw"Expecting number but found "+typeof b;switch(e[7]){case"b":b=b.toString(2);break;case"c":b=String.fromCharCode(b);break;case"d":b=parseInt(b);break;case"e":b=e[6]?b.toExponential(e[6]):b.toExponential();break;case"f":b=e[6]?parseFloat(b).toFixed(e[6]):parseFloat(b);break;case"o":b=b.toString(8);break;case"s":b=(b=String(b))&&e[6]?b.substring(0,e[6]):b;break;case"u":b=Math.abs(b);break;case"x":b=b.toString(16);break;case"X":b=b.toString(16).toUpperCase()}b=/[def]/.test(e[7])&&e[2]&&b>=0?"+"+b:b,g=e[3]?e[3]=="0"?"0":e[3].charAt(1):" ",h=e[5]-String(b).length-i.length,f=e[5]?str_repeat(g,h):"",d.push(i+(e[4]?b+f:f+b))}c=c.substring(e[0].length)}return d.join("")}"use strict";var topicExplorerApp=angular.module("topicExplorerApp",[]);topicExplorerApp.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),topicExplorerApp.factory("constants",function(){return{IFRAME_API_URL:"//www.youtube.com/iframe_api",GOOGLE_APIS_CLIENT_URL:"https://apis.google.com/js/client.js?onload=",GOOGLE_APIS_CLIENT_CALLBACK:"onClientLoad",OAUTH2_CLIENT_ID:"269758065116.apps.googleusercontent.com",OAUTH2_SCOPES:"https://www.googleapis.com/auth/youtube",OAUTH2_REVOKE_URL:"https://accounts.google.com/o/oauth2/revoke?token=",API_KEY:"AIzaSyAe112w0RobjC1XtoO3Os3YI6cvMZm9oKk",FREEBASE_API_URL:"https://www.googleapis.com/freebase/v1/search",YOUTUBE_API_SERVICE:"youtube",YOUTUBE_API_VERSION:"v3",FREEBASE_API_MAX_RESULTS:30,FREEBASE_CACHE_MINUTES:1440,YOUTUBE_CACHE_MINUTES:1440,MIN_SCORE:60,MAX_SCORE:100,SCORE_NORMALIZATION_FACTOR:35,YOUTUBE_API_MAX_RESULTS:50,DEFAULT_PROFILE_THUMBNAIL:"https://s.ytimg.com/yts/img/no_videos_140-vfl5AhOQY.png",VIDEO_KIND:"youtube#video",CHANNEL_KIND:"youtube#channel",PLAYLIST_KIND:"youtube#playlist",YOUTUBE_VIDEO_PAGE_URL_PREFIX:"http://youtu.be/",YOUTUBE_CHANNEL_PAGE_URL_PREFIX:"http://youtube.com/channel/",YOUTUBE_PLAYLIST_PAGE_URL_PREFIX:"http://www.youtube.com/playlist?list=",DEFAULT_DISPLAY_NAME:"Stranger"}}),topicExplorerApp.factory("youtube",["constants",function(a){function b(a,b){return a+JSON.stringify(b)}return function(c){c.path=[a.YOUTUBE_API_SERVICE,a.YOUTUBE_API_VERSION,c.service].join("/");var d=b(c.service,c.params),e=lscache.get(d);if(c.method=="GET"&&e)setTimeout(function(){c.callback(e)},1);else{var f=c.callback;delete c.callback;var g=a.YOUTUBE_CACHE_MINUTES;"cacheTimeoutMinutes"in c&&(g=c.cacheTimeoutMinutes);var h=gapi.client.request(c);h.execute(function(a){c.method=="GET"&&a&&!("error"in a)&&lscache.set(d,a,g),f(a)})}}}]),"use strict",topicExplorerApp.controller("MainCtrl",["$scope","$rootScope","$http","$window","constants","youtube",function(a,b,c,d,e,f){function g(b){a.topicResults=b.result.map(function(a){var b=a.name;a.notable&&a.notable.name&&(b+=" ("+a.notable.name+")");var c=a.score;return c>e.MAX_SCORE&&(c=e.MAX_SCORE),c<e.MIN_SCORE&&(c=e.MIN_SCORE),{name:b,mid:a.mid,style:{"font-size":c+"%",opacity:c/100}}})}function h(a,b){b=b.replace(/^UC/,"UU");var c=a.offsetWidth,d=a.offsetHeight;new YT.Player(a,{width:c,height:d,playerVars:{listType:"playlist",list:b,autoplay:1,controls:2,modestbranding:1,rel:0,showInfo:0}})}function i(a,b){var c=a.offsetWidth,d=a.offsetHeight;new YT.Player(a,{videoId:b,width:c,height:d,playerVars:{autoplay:1,controls:2,modestbranding:1,rel:0,showInfo:0}})}a.changeLanguage=function(a){b.currentLanguage=a},a.topicSearch=function(b){a.channelResults=[],a.playlistResults=[],a.videoResults=[];var d=lscache.get(b);if(d)g(d);else{var f=c.jsonp(e.FREEBASE_API_URL,{params:{query:b,key:e.API_KEY,limit:e.FREEBASE_API_MAX_RESULTS,callback:"JSON_CALLBACK"}});f.success(function(a){a.status=="200 OK"&&(lscache.set(b,a,e.FREEBASE_CACHE_MINUTES),g(a))})}},a.topicClicked=function(b,c){a.channelResults=[],a.playlistResults=[],a.videoResults=[],f({method:"GET",service:"search",params:{topicId:b,part:"snippet",type:"channel,video",maxResults:e.YOUTUBE_API_MAX_RESULTS,q:"site:youtube.com"},callback:function(b){a.$apply(function(){var c=[],d=[],f=[];"items"in b&&angular.forEach(b.items,function(a){switch(a.id.kind){case e.VIDEO_KIND:c.push({title:a.snippet.title,thumbnailUrl:a.snippet.thumbnails.high.url,id:a.id.videoId,href:e.YOUTUBE_VIDEO_PAGE_URL_PREFIX+a.id.videoId});break;case e.CHANNEL_KIND:d.push({title:a.snippet.title,thumbnailUrl:a.snippet.thumbnails.high.url,id:a.id.channelId,href:e.YOUTUBE_CHANNEL_PAGE_URL_PREFIX+a.id.channelId});break;case e.PLAYLIST_KIND:f.push({title:a.snippet.title,thumbnailUrl:a.snippet.thumbnails.high.url,id:a.id.playlistId,href:e.YOUTUBE_PLAYLIST_PAGE_URL_PREFIX+a.id.playlistId})}}),a.channelResults=d,a.playlistResults=f,a.videoResults=c})}})},a.addToList=function(a,c,d){var g=b.relatedPlaylists[c];a.textContent=topicExplorerApp.filter.i18n("ADDING"),a.disabled=!0,f({method:"POST",service:"playlistItems",params:{part:"snippet"},body:{snippet:{playlistId:g,resourceId:{kind:e.VIDEO_KIND,videoId:d}}},callback:function(b){"error"in b?a.textContent="Error":a.textContent=topicExplorerApp.filter.i18n("ADDED")}})},a.videoClicked=function(a,b){var f=a.parentElement;typeof YT!="undefined"&&typeof YT.Player!="undefined"?i(f,b):(d.onYouTubeIframeAPIReady=function(){i(f,b)},c.jsonp(e.IFRAME_API_URL))},a.listPlayerClicked=function(a,b){var f=a.parentElement;typeof YT!="undefined"&&typeof YT.Player!="undefined"?h(f,b):(d.onYouTubeIframeAPIReady=function(){h(f,b)},c.jsonp(e.IFRAME_API_URL))},a.subscribeClicked=function(a,c){a.textContent=topicExplorerApp.filter.i18n("SUSCRIBING"),a.disabled=!0,f({method:"POST",service:"subscriptions",params:{part:"snippet"},body:{snippet:{channelId:b.channelId,resourceId:{kind:e.CHANNEL_KIND,channelId:c}}},callback:function(b){"error"in b?a.textContent="Error":a.textContent=topicExplorerApp.filter.i18n("SUSCRIBED")}})}}]),"use strict",topicExplorerApp.controller("UserCtrl",["$scope","$rootScope","$http","$window","constants",function(a,b,c,d,e){function h(b){a.$apply(function(){b&&!b.error?a.template=g:a.template=f})}var f="views/logged-out.html",g="views/logged-in.html";a.template=f,d[e.GOOGLE_APIS_CLIENT_CALLBACK]=function(){gapi.client.setApiKey(e.API_KEY),setTimeout(function(){gapi.auth.authorize({client_id:e.OAUTH2_CLIENT_ID,scope:e.OAUTH2_SCOPES,immediate:!0},h)},1)},a.login=function(){gapi.auth.authorize({client_id:e.OAUTH2_CLIENT_ID,scope:e.OAUTH2_SCOPES,immediate:!1},h)},b.logout=function(){lscache.flush(),b.channelId=null,a.template=f,c.jsonp(e.OAUTH2_REVOKE_URL+gapi.auth.getToken().access_token)},c.jsonp(e.GOOGLE_APIS_CLIENT_URL+e.GOOGLE_APIS_CLIENT_CALLBACK)}]),"use strict",topicExplorerApp.controller("LoggedInCtrl",["$scope","$rootScope","$http","constants","youtube",function(a,b,c,d,e){function f(b){Array.isArray(b)||(b=[b]);var c=b.pop();e({method:"GET",service:"playlistItems",params:{part:"contentDetails",playlistId:c,maxResults:d.YOUTUBE_API_MAX_RESULTS},callback:function(c){"items"in c&&angular.forEach(c.items,function(b){a.videoIds.push(b.contentDetails.videoId)}),b.length>0?f(b):g()}})}function g(){var b=a.videoIds.slice(0,50);e({method:"GET",service:"videos",params:{part:"topicDetails",id:b.join(",")},callback:function(a){if("items"in a){var b={};angular.forEach(a.items,function(a){"topicDetails"in a&&angular.forEach(a.topicDetails.topicIds,function(a){a in b||(b[a]=0),b[a]++})});var c=[];angular.forEach(b,function(a,b){c.push({mid:b,score:a})}),h(c.slice(0,d.FREEBASE_API_MAX_RESULTS))}}})}function h(a){var b=a.pop();if(b){var e=lscache.get(b.mid);if(e)i(e,b.score),a.length>0?h(a):j();else{var f=c.jsonp(d.FREEBASE_API_URL,{params:{query:b.mid,key:d.API_KEY,limit:d.FREEBASE_API_MAX_RESULTS,callback:"JSON_CALLBACK"}});f.success(function(c){c.status=="200 OK"&&(lscache.set(b.mid,c,d.FREEBASE_CACHE_MINUTES),i(c,b.score)),a.length>0?h(a):j()})}}}function i(b,c){if(b.result.length>0){var e=b.result[0],f=e.name;e.notable&&e.notable.name&&(f+=" ("+e.notable.name+")");var g=c*d.SCORE_NORMALIZATION_FACTOR;g>d.MAX_SCORE&&(g=d.MAX_SCORE),g<d.MIN_SCORE&&(g=d.MIN_SCORE),a.personalizedTopics.push({name:f,mid:e.mid,score:c,style:{"font-size":g+"%",opacity:g/100}})}}function j(){var c=a.personalizedTopics.sort(function(a,b){return b.score-a.score});setTimeout(function(){b.$apply(function(){b.topicResults=c})},1)}a.thumbnailUrl=d.DEFAULT_PROFILE_THUMBNAIL,e({method:"GET",service:"channels",params:{mine:!0,part:"id,snippet,contentDetails"},callback:function(c){a.$apply(function(){if("items"in c){var e=c.items[0];a.title=e.snippet.title.split(/\W/)[0]||d.DEFAULT_DISPLAY_NAME,a.thumbnailUrl=e.snippet.thumbnails.default.url,b.channelId=e.id,b.relatedPlaylists=e.contentDetails.relatedPlaylists,a.videoIds=[],a.personalizedTopics=[],f([b.relatedPlaylists.watchLater,b.relatedPlaylists.favorites,b.relatedPlaylists.likes])}else a.title=d.DEFAULT_DISPLAY_NAME})}}),a.recommendations=function(){e({method:"GET",service:"activities",params:{part:"id,snippet,contentDetails",home:!0,maxResults:d.YOUTUBE_API_MAX_RESULTS},callback:function(b){"items"in b&&(a.videoIds=[],a.personalizedTopics=[],angular.forEach(b.items,function(b){b.snippet.type=="recommendation"&&b.contentDetails.recommendation.resourceId.videoId&&a.videoIds.push(b.contentDetails.recommendation.resourceId.videoId)})),g()}})}}]);var lang={en:{SPANISH:"Spanish",ENGLISH:"English",ABOUT:"About",SOURCE_CODE:"Source Code",LOGIN:"Log In",LOG_OUT:"Log Out",FETCHING_CHANNEL_INFO:"Fetching your channel info...",HEY:"Hey, ",INTERESTED_IN:"I'm interested in...",TOPICS:"Suggested Topics",CHANNELS:"Channels",SUBSCRIBE:"Subscribe",PLAYLISTS:"Playlists",VIDEOS:"Videos",LIKE:"Like",FAVORITE:"Favorite",WATCH_LATER:"Watch Later",ADDING:"Adding...",ADDED:"Added",SUSCRIBING:"Subscribing...",SUSCRIBED:"Subscribed",YOUTUBE_RECOMMENDATIONS:"YouTube Recommendations"},es:{SPANISH:"Espanol",ENGLISH:"Ingles",ABOUT:"Acerca de",SOURCE_CODE:"Codigo fuente",LOG_OUT:"Salir",LOGIN:"Ingresar",FETCHING_CHANNEL_INFO:"Obteniendo la informacion de su canal...",HEY:"Hola, ",INTERESTED_IN:"Estoy interesado en...",TOPICS:"Temas sugeridos",CHANNELS:"Canales",SUBSCRIBE:"Suscribirme",PLAYLISTS:"Listas de reproduccion",VIDEOS:"Videos",LIKE:"Me gusta",FAVORITE:"Favorito",WATCH_LATER:"Ver mas tarde",ADDING:"Agregando...",ADDED:"Agregado",SUSCRIBING:"Suscribiendo...",SUSCRIBED:"Suscripto",YOUTUBE_RECOMMENDATIONS:"Recomendaciones de YouTube"}};topicExplorerApp.filter("i18n",["$rootScope",function(a){return function(b){var c=!1,d=[];for(var e=1;e<arguments.length;e++)typeof arguments[e]=="object"?angular.forEach(arguments[e],function(a){d.push(a)}):d.push(arguments[e]);var f=a.currentLanguage||"en",g=lang[f][b];return g===undefined?(c!=1,sprintf(b,d)):sprintf(g,d)}}]);