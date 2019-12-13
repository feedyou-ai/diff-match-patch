var diff_match_patch=function(){this.Diff_Timeout=1;this.Diff_EditCost=4;this.Match_Threshold=.5;this.Match_Distance=1E3;this.Patch_DeleteThreshold=.5;this.Patch_Margin=4;this.Match_MaxBits=32},DIFF_DELETE=-1,DIFF_INSERT=1,DIFF_EQUAL=0;diff_match_patch.Diff=function(a,b){this[0]=a;this[1]=b};diff_match_patch.Diff.prototype.length=2;diff_match_patch.Diff.prototype.toString=function(){return this[0]+","+this[1]};
diff_match_patch.prototype.diff_main=function(a,b,d,c){"undefined"==typeof c&&(c=0>=this.Diff_Timeout?Number.MAX_VALUE:(new Date).getTime()+1E3*this.Diff_Timeout);if(null==a||null==b)throw Error("Null input. (diff_main)");if(a==b)return a?[new diff_match_patch.Diff(DIFF_EQUAL,a)]:[];"undefined"==typeof d&&(d=!0);var e=d,f=this.diff_commonPrefix(a,b);d=a.substring(0,f);a=a.substring(f);b=b.substring(f);f=this.diff_commonSuffix(a,b);var g=a.substring(a.length-f);a=a.substring(0,a.length-f);b=b.substring(0,
b.length-f);a=this.diff_compute_(a,b,e,c);d&&a.unshift(new diff_match_patch.Diff(DIFF_EQUAL,d));g&&a.push(new diff_match_patch.Diff(DIFF_EQUAL,g));this.diff_cleanupMerge(a);return a};
diff_match_patch.prototype.diff_compute_=function(a,b,d,c){if(!a)return[new diff_match_patch.Diff(DIFF_INSERT,b)];if(!b)return[new diff_match_patch.Diff(DIFF_DELETE,a)];var e=a.length>b.length?a:b,f=a.length>b.length?b:a,g=e.indexOf(f);return-1!=g?(d=[new diff_match_patch.Diff(DIFF_INSERT,e.substring(0,g)),new diff_match_patch.Diff(DIFF_EQUAL,f),new diff_match_patch.Diff(DIFF_INSERT,e.substring(g+f.length))],a.length>b.length&&(d[0][0]=d[2][0]=DIFF_DELETE),d):1==f.length?[new diff_match_patch.Diff(DIFF_DELETE,
a),new diff_match_patch.Diff(DIFF_INSERT,b)]:(e=this.diff_halfMatch_(a,b))?(b=e[1],f=e[3],a=e[4],e=this.diff_main(e[0],e[2],d,c),d=this.diff_main(b,f,d,c),e.concat([new diff_match_patch.Diff(DIFF_EQUAL,a)],d)):d&&100<a.length&&100<b.length?this.diff_lineMode_(a,b,c):this.diff_bisect_(a,b,c)};
diff_match_patch.prototype.diff_lineMode_=function(a,b,d){var c=this.diff_linesToChars_(a,b);a=c.chars1;b=c.chars2;c=c.lineArray;a=this.diff_main(a,b,!1,d);this.diff_charsToLines_(a,c);this.diff_cleanupSemantic(a);a.push(new diff_match_patch.Diff(DIFF_EQUAL,""));for(var e=c=b=0,f="",g="";b<a.length;){switch(a[b][0]){case DIFF_INSERT:e++;g+=a[b][1];break;case DIFF_DELETE:c++;f+=a[b][1];break;case DIFF_EQUAL:if(1<=c&&1<=e){a.splice(b-c-e,c+e);b=b-c-e;c=this.diff_main(f,g,!1,d);for(e=c.length-1;0<=e;e--)a.splice(b,
0,c[e]);b+=c.length}c=e=0;g=f=""}b++}a.pop();return a};
diff_match_patch.prototype.diff_bisect_=function(a,b,d){for(var c=a.length,e=b.length,f=Math.ceil((c+e)/2),g=2*f,h=Array(g),l=Array(g),k=0;k<g;k++)h[k]=-1,l[k]=-1;h[f+1]=0;l[f+1]=0;k=c-e;for(var m=0!=k%2,p=0,x=0,w=0,q=0,t=0;t<f&&!((new Date).getTime()>d);t++){for(var v=-t+p;v<=t-x;v+=2){var n=f+v;var r=v==-t||v!=t&&h[n-1]<h[n+1]?h[n+1]:h[n-1]+1;for(var y=r-v;r<c&&y<e&&a.charAt(r)==b.charAt(y);)r++,y++;h[n]=r;if(r>c)x+=2;else if(y>e)p+=2;else if(m&&(n=f+k-v,0<=n&&n<g&&-1!=l[n])){var u=c-l[n];if(r>=
u)return this.diff_bisectSplit_(a,b,r,y,d)}}for(v=-t+w;v<=t-q;v+=2){n=f+v;u=v==-t||v!=t&&l[n-1]<l[n+1]?l[n+1]:l[n-1]+1;for(r=u-v;u<c&&r<e&&a.charAt(c-u-1)==b.charAt(e-r-1);)u++,r++;l[n]=u;if(u>c)q+=2;else if(r>e)w+=2;else if(!m&&(n=f+k-v,0<=n&&n<g&&-1!=h[n]&&(r=h[n],y=f+r-n,u=c-u,r>=u)))return this.diff_bisectSplit_(a,b,r,y,d)}}return[new diff_match_patch.Diff(DIFF_DELETE,a),new diff_match_patch.Diff(DIFF_INSERT,b)]};
diff_match_patch.prototype.diff_bisectSplit_=function(a,b,d,c,e){var f=a.substring(0,d),g=b.substring(0,c);a=a.substring(d);b=b.substring(c);f=this.diff_main(f,g,!1,e);e=this.diff_main(a,b,!1,e);return f.concat(e)};
diff_match_patch.prototype.diff_linesToChars_=function(a,b){function d(a){for(var b="",d=0,g=-1,h=c.length;g<a.length-1;){g=a.indexOf("\n",d);-1==g&&(g=a.length-1);var l=a.substring(d,g+1);(e.hasOwnProperty?e.hasOwnProperty(l):void 0!==e[l])?b+=String.fromCharCode(e[l]):(h==f&&(l=a.substring(d),g=a.length),b+=String.fromCharCode(h),e[l]=h,c[h++]=l);d=g+1}return b}var c=[],e={};c[0]="";var f=4E4,g=d(a);f=65535;var h=d(b);return{chars1:g,chars2:h,lineArray:c}};
diff_match_patch.prototype.diff_charsToLines_=function(a,b){for(var d=0;d<a.length;d++){for(var c=a[d][1],e=[],f=0;f<c.length;f++)e[f]=b[c.charCodeAt(f)];a[d][1]=e.join("")}};diff_match_patch.prototype.diff_commonPrefix=function(a,b){if(!a||!b||a.charAt(0)!=b.charAt(0))return 0;for(var d=0,c=Math.min(a.length,b.length),e=c,f=0;d<e;)a.substring(f,e)==b.substring(f,e)?f=d=e:c=e,e=Math.floor((c-d)/2+d);return e};
diff_match_patch.prototype.diff_commonSuffix=function(a,b){if(!a||!b||a.charAt(a.length-1)!=b.charAt(b.length-1))return 0;for(var d=0,c=Math.min(a.length,b.length),e=c,f=0;d<e;)a.substring(a.length-e,a.length-f)==b.substring(b.length-e,b.length-f)?f=d=e:c=e,e=Math.floor((c-d)/2+d);return e};
diff_match_patch.prototype.diff_commonOverlap_=function(a,b){var d=a.length,c=b.length;if(0==d||0==c)return 0;d>c?a=a.substring(d-c):d<c&&(b=b.substring(0,d));d=Math.min(d,c);if(a==b)return d;c=0;for(var e=1;;){var f=a.substring(d-e);f=b.indexOf(f);if(-1==f)return c;e+=f;if(0==f||a.substring(d-e)==b.substring(0,e))c=e,e++}};
diff_match_patch.prototype.diff_halfMatch_=function(a,b){function d(a,b,c){for(var d=a.substring(c,c+Math.floor(a.length/4)),e=-1,g="",h,k,l,m;-1!=(e=b.indexOf(d,e+1));){var p=f.diff_commonPrefix(a.substring(c),b.substring(e)),u=f.diff_commonSuffix(a.substring(0,c),b.substring(0,e));g.length<u+p&&(g=b.substring(e-u,e)+b.substring(e,e+p),h=a.substring(0,c-u),k=a.substring(c+p),l=b.substring(0,e-u),m=b.substring(e+p))}return 2*g.length>=a.length?[h,k,l,m,g]:null}if(0>=this.Diff_Timeout)return null;
var c=a.length>b.length?a:b,e=a.length>b.length?b:a;if(4>c.length||2*e.length<c.length)return null;var f=this,g=d(c,e,Math.ceil(c.length/4));c=d(c,e,Math.ceil(c.length/2));if(g||c)g=c?g?g[4].length>c[4].length?g:c:c:g;else return null;if(a.length>b.length){c=g[0];e=g[1];var h=g[2];var l=g[3]}else h=g[0],l=g[1],c=g[2],e=g[3];return[c,e,h,l,g[4]]};
diff_match_patch.prototype.diff_cleanupSemantic=function(a){for(var b=!1,d=[],c=0,e=null,f=0,g=0,h=0,l=0,k=0;f<a.length;)a[f][0]==DIFF_EQUAL?(d[c++]=f,g=l,h=k,k=l=0,e=a[f][1]):(a[f][0]==DIFF_INSERT?l+=a[f][1].length:k+=a[f][1].length,e&&e.length<=Math.max(g,h)&&e.length<=Math.max(l,k)&&(a.splice(d[c-1],0,new diff_match_patch.Diff(DIFF_DELETE,e)),a[d[c-1]+1][0]=DIFF_INSERT,c--,c--,f=0<c?d[c-1]:-1,k=l=h=g=0,e=null,b=!0)),f++;b&&this.diff_cleanupMerge(a);this.diff_cleanupSemanticLossless(a);for(f=1;f<
a.length;){if(a[f-1][0]==DIFF_DELETE&&a[f][0]==DIFF_INSERT){b=a[f-1][1];d=a[f][1];c=this.diff_commonOverlap_(b,d);e=this.diff_commonOverlap_(d,b);if(c>=e){if(c>=b.length/2||c>=d.length/2)a.splice(f,0,new diff_match_patch.Diff(DIFF_EQUAL,d.substring(0,c))),a[f-1][1]=b.substring(0,b.length-c),a[f+1][1]=d.substring(c),f++}else if(e>=b.length/2||e>=d.length/2)a.splice(f,0,new diff_match_patch.Diff(DIFF_EQUAL,b.substring(0,e))),a[f-1][0]=DIFF_INSERT,a[f-1][1]=d.substring(0,d.length-e),a[f+1][0]=DIFF_DELETE,
a[f+1][1]=b.substring(e),f++;f++}f++}};
diff_match_patch.prototype.diff_cleanupSemanticLossless=function(a){function b(a,b){if(!a||!b)return 6;var c=a.charAt(a.length-1),d=b.charAt(0),e=c.match(diff_match_patch.nonAlphaNumericRegex_),f=d.match(diff_match_patch.nonAlphaNumericRegex_),g=e&&c.match(diff_match_patch.whitespaceRegex_),h=f&&d.match(diff_match_patch.whitespaceRegex_);c=g&&c.match(diff_match_patch.linebreakRegex_);d=h&&d.match(diff_match_patch.linebreakRegex_);var k=c&&a.match(diff_match_patch.blanklineEndRegex_),l=d&&b.match(diff_match_patch.blanklineStartRegex_);
return k||l?5:c||d?4:e&&!g&&h?3:g||h?2:e||f?1:0}for(var d=1;d<a.length-1;){if(a[d-1][0]==DIFF_EQUAL&&a[d+1][0]==DIFF_EQUAL){var c=a[d-1][1],e=a[d][1],f=a[d+1][1],g=this.diff_commonSuffix(c,e);if(g){var h=e.substring(e.length-g);c=c.substring(0,c.length-g);e=h+e.substring(0,e.length-g);f=h+f}g=c;h=e;for(var l=f,k=b(c,e)+b(e,f);e.charAt(0)===f.charAt(0);){c+=e.charAt(0);e=e.substring(1)+f.charAt(0);f=f.substring(1);var m=b(c,e)+b(e,f);m>=k&&(k=m,g=c,h=e,l=f)}a[d-1][1]!=g&&(g?a[d-1][1]=g:(a.splice(d-
1,1),d--),a[d][1]=h,l?a[d+1][1]=l:(a.splice(d+1,1),d--))}d++}};diff_match_patch.nonAlphaNumericRegex_=/[^a-zA-Z0-9]/;diff_match_patch.whitespaceRegex_=/\s/;diff_match_patch.linebreakRegex_=/[\r\n]/;diff_match_patch.blanklineEndRegex_=/\n\r?\n$/;diff_match_patch.blanklineStartRegex_=/^\r?\n\r?\n/;
diff_match_patch.prototype.diff_cleanupEfficiency=function(a){for(var b=!1,d=[],c=0,e=null,f=0,g=!1,h=!1,l=!1,k=!1;f<a.length;)a[f][0]==DIFF_EQUAL?(a[f][1].length<this.Diff_EditCost&&(l||k)?(d[c++]=f,g=l,h=k,e=a[f][1]):(c=0,e=null),l=k=!1):(a[f][0]==DIFF_DELETE?k=!0:l=!0,e&&(g&&h&&l&&k||e.length<this.Diff_EditCost/2&&3==g+h+l+k)&&(a.splice(d[c-1],0,new diff_match_patch.Diff(DIFF_DELETE,e)),a[d[c-1]+1][0]=DIFF_INSERT,c--,e=null,g&&h?(l=k=!0,c=0):(c--,f=0<c?d[c-1]:-1,l=k=!1),b=!0)),f++;b&&this.diff_cleanupMerge(a)};
diff_match_patch.prototype.diff_cleanupMerge=function(a){a.push(new diff_match_patch.Diff(DIFF_EQUAL,""));for(var b=0,d=0,c=0,e="",f="",g;b<a.length;)switch(a[b][0]){case DIFF_INSERT:c++;f+=a[b][1];b++;break;case DIFF_DELETE:d++;e+=a[b][1];b++;break;case DIFF_EQUAL:1<d+c?(0!==d&&0!==c&&(g=this.diff_commonPrefix(f,e),0!==g&&(0<b-d-c&&a[b-d-c-1][0]==DIFF_EQUAL?a[b-d-c-1][1]+=f.substring(0,g):(a.splice(0,0,new diff_match_patch.Diff(DIFF_EQUAL,f.substring(0,g))),b++),f=f.substring(g),e=e.substring(g)),
g=this.diff_commonSuffix(f,e),0!==g&&(a[b][1]=f.substring(f.length-g)+a[b][1],f=f.substring(0,f.length-g),e=e.substring(0,e.length-g))),b-=d+c,a.splice(b,d+c),e.length&&(a.splice(b,0,new diff_match_patch.Diff(DIFF_DELETE,e)),b++),f.length&&(a.splice(b,0,new diff_match_patch.Diff(DIFF_INSERT,f)),b++),b++):0!==b&&a[b-1][0]==DIFF_EQUAL?(a[b-1][1]+=a[b][1],a.splice(b,1)):b++,d=c=0,f=e=""}""===a[a.length-1][1]&&a.pop();d=!1;for(b=1;b<a.length-1;)a[b-1][0]==DIFF_EQUAL&&a[b+1][0]==DIFF_EQUAL&&(a[b][1].substring(a[b][1].length-
a[b-1][1].length)==a[b-1][1]?(a[b][1]=a[b-1][1]+a[b][1].substring(0,a[b][1].length-a[b-1][1].length),a[b+1][1]=a[b-1][1]+a[b+1][1],a.splice(b-1,1),d=!0):a[b][1].substring(0,a[b+1][1].length)==a[b+1][1]&&(a[b-1][1]+=a[b+1][1],a[b][1]=a[b][1].substring(a[b+1][1].length)+a[b+1][1],a.splice(b+1,1),d=!0)),b++;d&&this.diff_cleanupMerge(a)};
diff_match_patch.prototype.diff_xIndex=function(a,b){var d=0,c=0,e=0,f=0,g;for(g=0;g<a.length;g++){a[g][0]!==DIFF_INSERT&&(d+=a[g][1].length);a[g][0]!==DIFF_DELETE&&(c+=a[g][1].length);if(d>b)break;e=d;f=c}return a.length!=g&&a[g][0]===DIFF_DELETE?f:f+(b-e)};
diff_match_patch.prototype.diff_prettyHtml=function(a){for(var b=[],d=/&/g,c=/</g,e=/>/g,f=/\n/g,g=0;g<a.length;g++){var h=a[g][0],l=a[g][1].replace(d,"&amp;").replace(c,"&lt;").replace(e,"&gt;").replace(f,"&para;<br>");switch(h){case DIFF_INSERT:b[g]='<ins style="background:#e6ffe6;">'+l+"</ins>";break;case DIFF_DELETE:b[g]='<del style="background:#ffe6e6;">'+l+"</del>";break;case DIFF_EQUAL:b[g]="<span>"+l+"</span>"}}return b.join("")};
diff_match_patch.prototype.diff_text1=function(a){for(var b=[],d=0;d<a.length;d++)a[d][0]!==DIFF_INSERT&&(b[d]=a[d][1]);return b.join("")};diff_match_patch.prototype.diff_text2=function(a){for(var b=[],d=0;d<a.length;d++)a[d][0]!==DIFF_DELETE&&(b[d]=a[d][1]);return b.join("")};
diff_match_patch.prototype.diff_levenshtein=function(a){for(var b=0,d=0,c=0,e=0;e<a.length;e++){var f=a[e][1];switch(a[e][0]){case DIFF_INSERT:d+=f.length;break;case DIFF_DELETE:c+=f.length;break;case DIFF_EQUAL:b+=Math.max(d,c),c=d=0}}return b+=Math.max(d,c)};diff_match_patch.prototype.isHighSurrogate=function(a){a=a.charCodeAt(0);return 55296<=a&&56319>=a};diff_match_patch.prototype.isLowSurrogate=function(a){a=a.charCodeAt(0);return 56320<=a&&57343>=a};
diff_match_patch.prototype.diff_toDelta=function(a){for(var b=[],d,c=0;c<a.length;c++){var e=a[c],f=e[1][0],g=e[1][e[1].length-1];if(0!==e[1].length&&(g&&this.isHighSurrogate(g)&&(d=g,e[1]=e[1].slice(0,-1)),d&&f&&this.isHighSurrogate(d)&&this.isLowSurrogate(f)&&(e[1]=d+e[1]),DIFF_EQUAL===e[0]&&(d=g),0!==e[1].length))switch(e[0]){case DIFF_INSERT:b.push("+"+encodeURI(e[1]));break;case DIFF_DELETE:b.push("-"+e[1].length);break;case DIFF_EQUAL:b.push("="+e[1].length)}}return b.join("\t").replace(/%20/g,
" ")};
diff_match_patch.prototype.decodeURI=function(a){try{return decodeURI(a)}catch(h){for(var b=0,d="";b<a.length;)if("%"!==a[b])d+=a[b++];else{var c=parseInt(a.substring(b+1,b+3),16);if(0===(c&128))d+=String.fromCharCode(c),b+=3;else{if("%"!==a[b+3])throw new URIError("URI malformed");var e=parseInt(a.substring(b+4,b+6),16);if(128!==(e&192))throw new URIError("URI malformed");e&=63;if(192===(c&224))d+=String.fromCharCode((c&31)<<6|e),b+=6;else{if("%"!==a[b+6])throw new URIError("URI malformed");var f=
parseInt(a.substring(b+7,b+9),16);if(128!==(f&192))throw new URIError("URI malformed");f&=63;if(224===(c&240))d+=String.fromCharCode((c&15)<<12|e<<6|f),b+=9;else{if("%"!==a[b+9])throw new URIError("URI malformed");var g=parseInt(a.substring(b+10,b+12),16);if(128!==(g&192))throw new URIError("URI malformed");g&=63;if(240===(c&248)&&(c=(c&7)<<18|e<<12|f<<6|g,65536<=c&&1114111>=c)){d+=String.fromCharCode((c&65535)>>>10&1023|55296);d+=String.fromCharCode(56320|c&1023);b+=12;continue}throw new URIError("URI malformed");
}}}}return d}};
diff_match_patch.prototype.diff_fromDelta=function(a,b){for(var d=[],c=0,e=0,f=b.split(/\t/g),g=0;g<f.length;g++){var h=f[g].substring(1);switch(f[g].charAt(0)){case "+":try{d[c++]=new diff_match_patch.Diff(DIFF_INSERT,this.decodeURI(h))}catch(k){throw Error("Illegal escape in diff_fromDelta: "+h);}break;case "-":case "=":var l=parseInt(h,10);if(isNaN(l)||0>l)throw Error("Invalid number in diff_fromDelta: "+h);h=a.substring(e,e+=l);"="==f[g].charAt(0)?d[c++]=new diff_match_patch.Diff(DIFF_EQUAL,h):
d[c++]=new diff_match_patch.Diff(DIFF_DELETE,h);break;default:if(f[g])throw Error("Invalid diff operation in diff_fromDelta: "+f[g]);}}if(e!=a.length)throw Error("Delta length ("+e+") does not equal source text length ("+a.length+").");return d};diff_match_patch.prototype.match_main=function(a,b,d){if(null==a||null==b||null==d)throw Error("Null input. (match_main)");d=Math.max(0,Math.min(d,a.length));return a==b?0:a.length?a.substring(d,d+b.length)==b?d:this.match_bitap_(a,b,d):-1};
diff_match_patch.prototype.match_bitap_=function(a,b,d){function c(a,c){var e=a/b.length,g=Math.abs(d-c);return f.Match_Distance?e+g/f.Match_Distance:g?1:e}if(b.length>this.Match_MaxBits)throw Error("Pattern too long for this browser.");var e=this.match_alphabet_(b),f=this,g=this.Match_Threshold,h=a.indexOf(b,d);-1!=h&&(g=Math.min(c(0,h),g),h=a.lastIndexOf(b,d+b.length),-1!=h&&(g=Math.min(c(0,h),g)));var l=1<<b.length-1;h=-1;for(var k,m,p=b.length+a.length,x,w=0;w<b.length;w++){k=0;for(m=p;k<m;)c(w,
d+m)<=g?k=m:p=m,m=Math.floor((p-k)/2+k);p=m;k=Math.max(1,d-m+1);var q=Math.min(d+m,a.length)+b.length;m=Array(q+2);for(m[q+1]=(1<<w)-1;q>=k;q--){var t=e[a.charAt(q-1)];m[q]=0===w?(m[q+1]<<1|1)&t:(m[q+1]<<1|1)&t|(x[q+1]|x[q])<<1|1|x[q+1];if(m[q]&l&&(t=c(w,q-1),t<=g))if(g=t,h=q-1,h>d)k=Math.max(1,2*d-h);else break}if(c(w+1,d)>g)break;x=m}return h};
diff_match_patch.prototype.match_alphabet_=function(a){for(var b={},d=0;d<a.length;d++)b[a.charAt(d)]=0;for(d=0;d<a.length;d++)b[a.charAt(d)]|=1<<a.length-d-1;return b};
diff_match_patch.prototype.patch_addContext_=function(a,b){if(0!=b.length){if(null===a.start2)throw Error("patch not initialized");for(var d=b.substring(a.start2,a.start2+a.length1),c=0;b.indexOf(d)!=b.lastIndexOf(d)&&d.length<this.Match_MaxBits-this.Patch_Margin-this.Patch_Margin;)c+=this.Patch_Margin,d=b.substring(a.start2-c,a.start2+a.length1+c);c+=this.Patch_Margin;(d=b.substring(a.start2-c,a.start2))&&a.diffs.unshift(new diff_match_patch.Diff(DIFF_EQUAL,d));(c=b.substring(a.start2+a.length1,
a.start2+a.length1+c))&&a.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL,c));a.start1-=d.length;a.start2-=d.length;a.length1+=d.length+c.length;a.length2+=d.length+c.length}};
diff_match_patch.prototype.patch_make=function(a,b,d){if("string"==typeof a&&"string"==typeof b&&"undefined"==typeof d){var c=a;b=this.diff_main(c,b,!0);2<b.length&&(this.diff_cleanupSemantic(b),this.diff_cleanupEfficiency(b))}else if(a&&"object"==typeof a&&"undefined"==typeof b&&"undefined"==typeof d)b=a,c=this.diff_text1(b);else if("string"==typeof a&&b&&"object"==typeof b&&"undefined"==typeof d)c=a;else if("string"==typeof a&&"string"==typeof b&&d&&"object"==typeof d)c=a,b=d;else throw Error("Unknown call format to patch_make.");
if(0===b.length)return[];d=[];a=new diff_match_patch.patch_obj;for(var e=0,f=0,g=0,h=c,l=0;l<b.length;l++){var k=b[l][0],m=b[l][1];e||k===DIFF_EQUAL||(a.start1=f,a.start2=g);switch(k){case DIFF_INSERT:a.diffs[e++]=b[l];a.length2+=m.length;c=c.substring(0,g)+m+c.substring(g);break;case DIFF_DELETE:a.length1+=m.length;a.diffs[e++]=b[l];c=c.substring(0,g)+c.substring(g+m.length);break;case DIFF_EQUAL:m.length<=2*this.Patch_Margin&&e&&b.length!=l+1?(a.diffs[e++]=b[l],a.length1+=m.length,a.length2+=m.length):
m.length>=2*this.Patch_Margin&&e&&(this.patch_addContext_(a,h),d.push(a),a=new diff_match_patch.patch_obj,e=0,h=c,f=g)}k!==DIFF_INSERT&&(f+=m.length);k!==DIFF_DELETE&&(g+=m.length)}e&&(this.patch_addContext_(a,h),d.push(a));return d};
diff_match_patch.prototype.patch_deepCopy=function(a){for(var b=[],d=0;d<a.length;d++){var c=a[d],e=new diff_match_patch.patch_obj;e.diffs=[];for(var f=0;f<c.diffs.length;f++)e.diffs[f]=new diff_match_patch.Diff(c.diffs[f][0],c.diffs[f][1]);e.start1=c.start1;e.start2=c.start2;e.length1=c.length1;e.length2=c.length2;b[d]=e}return b};
diff_match_patch.prototype.patch_apply=function(a,b){if(0==a.length)return[b,[]];a=this.patch_deepCopy(a);var d=this.patch_addPadding(a);b=d+b+d;this.patch_splitMax(a);for(var c=0,e=[],f=0;f<a.length;f++){var g=a[f].start2+c,h=this.diff_text1(a[f].diffs),l=-1;if(h.length>this.Match_MaxBits){var k=this.match_main(b,h.substring(0,this.Match_MaxBits),g);-1!=k&&(l=this.match_main(b,h.substring(h.length-this.Match_MaxBits),g+h.length-this.Match_MaxBits),-1==l||k>=l)&&(k=-1)}else k=this.match_main(b,h,
g);if(-1==k)e[f]=!1,c-=a[f].length2-a[f].length1;else if(e[f]=!0,c=k-g,g=-1==l?b.substring(k,k+h.length):b.substring(k,l+this.Match_MaxBits),h==g)b=b.substring(0,k)+this.diff_text2(a[f].diffs)+b.substring(k+h.length);else if(g=this.diff_main(h,g,!1),h.length>this.Match_MaxBits&&this.diff_levenshtein(g)/h.length>this.Patch_DeleteThreshold)e[f]=!1;else{this.diff_cleanupSemanticLossless(g);h=0;var m;for(l=0;l<a[f].diffs.length;l++){var p=a[f].diffs[l];p[0]!==DIFF_EQUAL&&(m=this.diff_xIndex(g,h));p[0]===
DIFF_INSERT?b=b.substring(0,k+m)+p[1]+b.substring(k+m):p[0]===DIFF_DELETE&&(b=b.substring(0,k+m)+b.substring(k+this.diff_xIndex(g,h+p[1].length)));p[0]!==DIFF_DELETE&&(h+=p[1].length)}}}b=b.substring(d.length,b.length-d.length);return[b,e]};
diff_match_patch.prototype.patch_addPadding=function(a){for(var b=this.Patch_Margin,d="",c=1;c<=b;c++)d+=String.fromCharCode(c);for(c=0;c<a.length;c++)a[c].start1+=b,a[c].start2+=b;c=a[0];var e=c.diffs;if(0==e.length||e[0][0]!=DIFF_EQUAL)e.unshift(new diff_match_patch.Diff(DIFF_EQUAL,d)),c.start1-=b,c.start2-=b,c.length1+=b,c.length2+=b;else if(b>e[0][1].length){var f=b-e[0][1].length;e[0][1]=d.substring(e[0][1].length)+e[0][1];c.start1-=f;c.start2-=f;c.length1+=f;c.length2+=f}c=a[a.length-1];e=c.diffs;
0==e.length||e[e.length-1][0]!=DIFF_EQUAL?(e.push(new diff_match_patch.Diff(DIFF_EQUAL,d)),c.length1+=b,c.length2+=b):b>e[e.length-1][1].length&&(f=b-e[e.length-1][1].length,e[e.length-1][1]+=d.substring(0,f),c.length1+=f,c.length2+=f);return d};
diff_match_patch.prototype.patch_splitMax=function(a){for(var b=this.Match_MaxBits,d=0;d<a.length;d++)if(!(a[d].length1<=b)){var c=a[d];a.splice(d--,1);for(var e=c.start1,f=c.start2,g="";0!==c.diffs.length;){var h=new diff_match_patch.patch_obj,l=!0;h.start1=e-g.length;h.start2=f-g.length;""!==g&&(h.length1=h.length2=g.length,h.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL,g)));for(;0!==c.diffs.length&&h.length1<b-this.Patch_Margin;){g=c.diffs[0][0];var k=c.diffs[0][1];g===DIFF_INSERT?(h.length2+=
k.length,f+=k.length,h.diffs.push(c.diffs.shift()),l=!1):g===DIFF_DELETE&&1==h.diffs.length&&h.diffs[0][0]==DIFF_EQUAL&&k.length>2*b?(h.length1+=k.length,e+=k.length,l=!1,h.diffs.push(new diff_match_patch.Diff(g,k)),c.diffs.shift()):(k=k.substring(0,b-h.length1-this.Patch_Margin),h.length1+=k.length,e+=k.length,g===DIFF_EQUAL?(h.length2+=k.length,f+=k.length):l=!1,h.diffs.push(new diff_match_patch.Diff(g,k)),k==c.diffs[0][1]?c.diffs.shift():c.diffs[0][1]=c.diffs[0][1].substring(k.length))}g=this.diff_text2(h.diffs);
g=g.substring(g.length-this.Patch_Margin);k=this.diff_text1(c.diffs).substring(0,this.Patch_Margin);""!==k&&(h.length1+=k.length,h.length2+=k.length,0!==h.diffs.length&&h.diffs[h.diffs.length-1][0]===DIFF_EQUAL?h.diffs[h.diffs.length-1][1]+=k:h.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL,k)));l||a.splice(++d,0,h)}}};diff_match_patch.prototype.patch_toText=function(a){for(var b=[],d=0;d<a.length;d++)b[d]=a[d];return b.join("")};
diff_match_patch.prototype.patch_fromText=function(a){var b=[];if(!a)return b;a=a.split("\n");for(var d=0,c=/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;d<a.length;){var e=a[d].match(c);if(!e)throw Error("Invalid patch string: "+a[d]);var f=new diff_match_patch.patch_obj;b.push(f);f.start1=parseInt(e[1],10);""===e[2]?(f.start1--,f.length1=1):"0"==e[2]?f.length1=0:(f.start1--,f.length1=parseInt(e[2],10));f.start2=parseInt(e[3],10);""===e[4]?(f.start2--,f.length2=1):"0"==e[4]?f.length2=0:(f.start2--,f.length2=
parseInt(e[4],10));for(d++;d<a.length;){e=a[d].charAt(0);try{var g=decodeURI(a[d].substring(1))}catch(h){throw Error("Illegal escape in patch_fromText: "+g);}if("-"==e)f.diffs.push(new diff_match_patch.Diff(DIFF_DELETE,g));else if("+"==e)f.diffs.push(new diff_match_patch.Diff(DIFF_INSERT,g));else if(" "==e)f.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL,g));else if("@"==e)break;else if(""!==e)throw Error('Invalid patch mode "'+e+'" in: '+g);d++}}return b};
diff_match_patch.patch_obj=function(){this.diffs=[];this.start2=this.start1=null;this.length2=this.length1=0};
diff_match_patch.patch_obj.prototype.toString=function(){for(var a=["@@ -"+(0===this.length1?this.start1+",0":1==this.length1?this.start1+1:this.start1+1+","+this.length1)+" +"+(0===this.length2?this.start2+",0":1==this.length2?this.start2+1:this.start2+1+","+this.length2)+" @@\n"],b,d=0;d<this.diffs.length;d++){switch(this.diffs[d][0]){case DIFF_INSERT:b="+";break;case DIFF_DELETE:b="-";break;case DIFF_EQUAL:b=" "}a[d+1]=b+encodeURI(this.diffs[d][1])+"\n"}return a.join("").replace(/%20/g," ")};
this.diff_match_patch=diff_match_patch;this.DIFF_DELETE=DIFF_DELETE;this.DIFF_INSERT=DIFF_INSERT;this.DIFF_EQUAL=DIFF_EQUAL;