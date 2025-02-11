// utils.js - a variety of useful functions and shortcuts
import {Sit} from "./Globals";

const MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0; r<d.length; r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0; m<_.length; m++)_[m]=0;for(m=0; m<8*d.length; m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0; m<32*d.length; m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d, _){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0; n<d.length; n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d, _, m, f, r, i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d, _, m, f, r, i, n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d, _, m, f, r, i, n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d, _, m, f, r, i, n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d, _, m, f, r, i, n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d, _){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d, _){return d<<_|d>>>32-_}

// short versions of commonly used Math functions. Maybe not optimal for heavy use?
function abs(x) {return Math.abs(x)}
function floor(x) {return Math.floor(x)}
function sin(x) {return Math.sin(x)}
function cos(x) {return Math.cos(x)}
function tan(x) {return Math.tan(x)}
function asin(x) {return Math.asin(x)}
function acos(x) {return Math.acos(x)}
function atan(x) {return Math.atan(x)}
function atan2(y,x) {return Math.atan2(y,x)}  // note unexpected parameter order

function metersFromMiles(m) {return 1609.344*m}
export function metersFromNM(m) {return 1852*m}
export function metersFromBig(m) {return Sit.big2M * m}
export function metersFromFeet(f) {return  3.28084 * f}
export function NMFromMeters(m) {return m/1852}

function radians(Value) {     return Value * Math.PI / 180;}

function degrees(Value) {    return Value / (Math.PI / 180);}

export var scaleF2M = 0.3048

export function f2m(f) {return f * scaleF2M}
export function m2f(m) {return m / scaleF2M}

// pad a string with leading zeros if it is shorter than the required size
// longer numbers are returned unchanged
function pad(num, size) {
    const numString = num.toString()
    if (numString.length > size) return numString;
    const s = "0000000000000000000" + numString;
    return s.slice(-size);
}

var assert
// not much point nulling the assert function, as it still gets called
// it would save one test, but remote asserts are useful
//if (isLocal) {
assert = function(condition,message=false) {
    if (!condition){
        console.trace()
        console.error("ASSERT: "+message);
        debugger;
    }
}
//}
//    else
//        assert = function() {}
//}

export {metersFromMiles, assert,MD5,abs,floor,sin,cos,tan,asin,acos,atan,atan2,radians,degrees,pad}





// given an array and a sample window size, then return a same sized array
// that has been smoothed by the rolling average method
// (somewhat ad-hoc method, by Mick)
export function RollingAverage(data, window, iterations=1) {

    for (var i=0;i<iterations;i++) {
        var output = new Array()
        const len = data.length;

        // conversion from strings would typically be when data is a CSV column or similar.
        if (typeof data[0] !== 'number') {
            data = data.map(x => parseFloat(x))
        }

        var xa = -1;
        var xb = -1;
        var sum = 0;
        const halfWindow = parseInt(window / 2) // force int, as otherwise it fails for odd numbers

        for (var f = 0; f < len; f++) {
            var a = f - halfWindow
            var b = f + halfWindow

            if (a < 0) {
                // a needs bringing up by -a to 0
                // so we also bring b down by a
                b += a;
                a = 0
            }
            if (b >= len) {
                // likewise at the end
                a += (b - (len - 1))
                b = len - 1
            }

            const samples = b - a + 1;


            // this might be the discontinuity problem
            // keeping a running total. CHECK.....
            if (xa === -1) {
                sum = 0;
                for (var x = a; x <= b; x++)
                    sum += (data[x])
                //sum += parseFloat(data[x])
                xa = a
                xb = b

            } else {

                // and or b may have moved one or two, so account for that
                if (xb === b - 2) {
                    sum += (data[b]) + (data[b - 1])
                    xb = b;
                } else if (xb === b - 1) {
                    sum += (data[b])
                    xb = b;
                }
                if (xa === a - 2) {
                    sum -= (data[xa] + data[xa + 1]) // note, subtracting the bottom of the window, very slight possibility of floating point variances
                    xa = a;
                } else if (xa === a - 1) {
                    sum -= (data[xa]) // note, subtracting the bottom of the window, very slight possibility of floating point variances
                    xa = a;
                }

            }
            output.push(sum / samples)

//            if (f < 120 && halfWindow === 100) {
//                console.log(f+": "+a+" -> "+b+", samples="+ samples+" sum/samples = "+(sum/samples))
//            }

        }
        data = output;
    }
    return output;
}


// same for degrees, handling wrap-around by independently smoothing the sine and cos of the angles
export function RollingAverageDegrees(data, window, iterations=1) {
    const length = data.length;

    const sines = new Array(length)
    const cosines = new Array(length)
    for (let i=0;i<length;i++) {
        const rad = radians(data[i])
        sines[i] = Math.sin(rad)
        cosines[i] = Math.cos(rad)
    }

    const smoothedSines   = RollingAverage(sines,   window, iterations)
    const smoothedCosines = RollingAverage(cosines, window, iterations)

    const output = new Array(length)
    for (let i=0;i<length;i++) {
        output[i] = degrees(Math.atan2(smoothedSines[i],smoothedCosines[i]))
    }

    return output;
}


// given a 1d array of values, calculate the local derivatives of those values
// then smooth that
// then recalculate the values bases of that derivative
// (i.e. given positions, calculate the speed, then smooth the speed, then calculate new positions
export function smoothDerivative(data, window, iterations) {
    const derivatives = []
    const len = data.length;
    for (var i=0;i<len-1;i++) {
        derivatives.push(data[i+1] - data[i])
    }
    const smoothedDerivatives = RollingAverage(derivatives,window,iterations)
    const output = []
    output.push (data[0])
    for (i=0;i<len-1;i++) {
        output.push(output[i]+smoothedDerivatives[i])
    }
    return output
}




// in the input array, column 1 is the index, column 2 is the value
// expand it to a single array of one entry per frame
// if no keyfraomes for first (0) and last frame, then it's a flat
// extension of the first/last values.
// optionally specify which columns the index and the data come from
// NOTE: This is doing a simple linear interpolation, leading to discontinuities
// in the first derivative
// CHECK FIRST that it's accurate
// MAYBE JUET SMOOTH?
export function ExpandKeyframes(input, outLen, indexCol = 0, dataCol = 1) {
    var out = new Array()
    var aFrame = parseInt(input[0][indexCol])
    var aValue = parseFloat(input[0][dataCol])
    var f = 0;
    input.forEach(function (frame, index) {
        var bFrame = parseInt(frame[indexCol])
        var bValue = parseFloat(frame[dataCol])
        out.push(aValue)
      //  console.log(f+": "+out[f]);
        f++;
        for (var i = aFrame + 1; i < bFrame; i++) {
            out.push(aValue + (i - aFrame) * (bValue - aValue) / (bFrame - aFrame))
      //      console.log(f+": "+out[f]);
            f++;
        }

        aFrame = bFrame
        aValue = bValue
    })
    // fill up any remaining with the last frame
    // will be at least one, as the last fencepost possible is outLen-1
    // and the above always stops short of the last fencepost
    for (var i = aFrame; i < outLen; i++) {
        out.push(aValue)
    }
    return out;
}

/**
 * (ChatGPT)
 * Returns a value from a specific column (`dataColumn`) based on the frame number provided.
 * It searches for the first row where the value in the `frameColumn` is less than or equal to the `frameNumber`
 * but the next row's `frameColumn` value is greater than the `frameNumber`.
 *
 * If the `frameNumber` is greater than or equal to the last value in `frameColumn`, the function will
 * return the value from `dataColumn` of the last row.
 *
 * @param {Array} data - The 2D array containing the data to search.
 * @param {number} frameColumn - The column index which contains frame numbers.
 * @param {number} dataColumn - The column index from which the result value should be returned.
 * @param {number} frameNumber - The frame number to search for.
 *
 * @returns {any|null} The value from `dataColumn` based on the search criteria or null if no match is found.
 */
export function getArrayValueFromFrame(data, frameColumn, dataColumn, frameNumber) {
    for (let i = 0; i < data.length - 1; i++) {
        if (data[i][frameColumn] <= frameNumber && data[i + 1][frameColumn] > frameNumber) {
            return data[i][dataColumn];
        }
    }

    // Handle the case where frameNumber is greater than or equal to the last value in frameColumn
    if (data[data.length - 1][frameColumn] <= frameNumber) {
        return data[data.length - 1][dataColumn];
    }

    return null; // Return null or another appropriate value if no match is found.
}


export function metersPerSecondFromKnots(k) {
//    return 1.68781 * k  // old was ft per second
    return 0.514444 * k
}

// given a time in ms, an interval in ms, and function f
// then call f for that time, every interval
export async function doOver(time, interval, f) {
    for (var t=0;t<=time;t+=interval) {
        f(t);
        await sleep(interval)
    }
}

// https://stackoverflow.com/questions/33137588/how-do-i-draw-a-rectangle-around-a-text-in-html-canvas
export function getTextBBox( ctx, text ) {
    const metrics = ctx.measureText( text );
    const left = metrics.actualBoundingBoxLeft * -1;
    const top = metrics.actualBoundingBoxAscent * -1;
    const right = metrics.actualBoundingBoxRight;
    const bottom = metrics.actualBoundingBoxDescent;
    // actualBoundinBox... excludes white spaces
    const width = text.trim() === text ? right - left : metrics.width;
    const height = bottom - top;
    return { left, top, right, bottom, width, height };
}

export var loadImage = async (src) => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Image loading failed'));
        img.src = src;
    });
};

export function vdump(v,decimals,a='(', b=')') {
    if (v.position !== undefined) {
        v = v.position;
        a='P'+a
    }
    if (decimals === undefined)
        return (a+v.x+","+v.y+","+v.z+b)
    else
        return (a+v.x.toFixed(decimals)+","+v.y.toFixed(decimals)+","+v.z.toFixed(decimals)+b)
}

var scrollTop, scrollLeft
export function disableScroll() {
    // Get the current page scroll position
    scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

        // if any scroll is attempted,
        // set this to the previous value
        window.onscroll = function() {
            window.scrollTo(scrollLeft, scrollTop);
        };
}

export function enableScroll() {
    window.onscroll = function() {};
}

// check if three 2D XY points are clockwise
// We calculate, essentially, the z component 3D cross product of the vectors p0->p1 and p0->p2
// which is the same as the 2D cross product
export function clockwiseXY(p0,p1,p2) {
    const ax = p1.x-p0.x
    const ay = p1.y-p0.y
    const bx = p2.x-p0.x
    const by = p2.y-p0.y
    const zCross = ax * by - ay * bx
    return zCross > 0
}

export function clockwiseZX(p0,p1,p2) {
    const ax = p1.z-p0.z
    const ay = p1.x-p0.x
    const bx = p2.z-p0.z
    const by = p2.x-p0.x
    const zCross = ax * by - ay * bx
    return zCross > 0
}




// given three points A,B,C forming a triangle
// adjust point B, so that ABC is a right angle
export function makeBRight(A,B,C) {
    const ABN = B.clone().sub(A).normalize()
    const CB = B.clone().sub(C)
    const CB_dot_ABN = CB.dot(ABN)
    const CB_on_ABN = ABN.clone().multiplyScalar(-CB_dot_ABN)
    B.add(CB_on_ABN)
}

export function interpolate(a,b,fraction) {
    return a+fraction*(b-a)
}


export function utcDate(d) {
    return d.toISOString().replace('T',' ').replace('Z',' UTC')
}

export function timezoneAbbreviation() {
    let [, tzName] = /.*\s(.+)/.exec((new Date()).toLocaleDateString(navigator.language, { timeZoneName: 'short' }));
    return tzName;
}

export function localDate(d) {
   // let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return d.toLocaleString() +" "+timezoneAbbreviation()
}



// see: https://stackoverflow.com/questions/7848004/get-column-from-a-two-dimensional-array/63860734
export const arrayColumn = (arr, n) => arr.map(x => x[n]);

/* View in fullscreen */
export function openFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
} /* Close fullscreen */
export function closeFullscreen() {
    var elem = document.documentElement;
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

export const versionString = MD5(document.lastModified) // if we want to make version-unique names

// difference between two angles, accounting for wrap around and angles <0 and >=360
export function angleDifferenceDeg(a,b) {
    while (a<0) a+=360;
    while (a>=360) a-=360;
    while (b<0) b+=360;
    while (b>=360) b-=360;
    var d = Math.abs(b-a);
    if (d > 180) d = 360-d
    return d
}

export function isSubdomain(domainToCheck, baseDomain) {
    // Ensure that both domainToCheck and baseDomain are in lowercase for accurate comparison
    domainToCheck = domainToCheck.toLowerCase();
    baseDomain = baseDomain.toLowerCase();

    // Add a dot at the beginning of the baseDomain to ensure we're matching subdomains
    // and not domains that merely end with the same sequence.
    const pattern = new RegExp('(^|\\.)' + baseDomain.replace('.', '\\.') + '$');

    return pattern.test(domainToCheck);
}

// // Example usage:
// console.log(isSubdomain("www.example.org", "example.org")); // Should return true
// console.log(isSubdomain("example.org", "example.org"));     // Should return true
// console.log(isSubdomain("forum.example.org", "example.org"));// Should return true
// console.log(isSubdomain("example.com", "example.org"));     // Should return false
// console.log(isSubdomain("test.com", "example.org"));         // Should return false


// export function getFileExtension(url) {
//     // Find the last dot in the URL
//     const lastDotIndex = url.lastIndexOf('.');
//
//     // Extract the extension from the last dot to the end of the string
//     // If there is no dot, or it's the first character (unlikely for URLs but could be for file paths), return an empty string
//     if (lastDotIndex === -1 || lastDotIndex === 0) return '';
//
//     // Return the substring from the character after the dot to the end of the string
//     return url.substring(lastDotIndex);
// }

// Example usage
// var url = "http://example.com/file.html";
// var ext = getFileExtension(url); // ext would be '.html'


export function isHttpOrHttps(url) {
    const pattern = /^(http|https):\/\//;
    return pattern.test(url);
}

export function getFileExtension(filename) {
    var splitDot = filename.split('.')
    var fileExt = splitDot.pop();
    // if the extension ends in a / then we are probably trying to load an attachment
    // like https://www.metabunk.org/attachments/n615ux-track-egm96-kml.54528/
    // from Metabunk, so the extension is actually the end of the string before the last .
    // and the dots have been replaced with dashes
    if (fileExt.slice(-1) === "/") {
        var beforeExt = splitDot.pop();
        fileExt = beforeExt.split('-').pop()
    }
    return fileExt.toLowerCase();
}

// Finds the current browser URL, strips off the parameters, and adds new ones
// then pushes it, if changed
export function setURLParameters(params) {

    const oldURL = window.location.href;

    // get the base of the URL (e.g. https://www.metabunk.org/sitrec/
    var url = oldURL.split('?')[0];

    // and add that to the base URL
    url += "?sitch=" + Sit.name + params;

    if (oldURL.localeCompare(url) != 0) {
        // then push the current state, so we can go back
        window.history.pushState({}, null, url);
    }

}

export function stripParentheses(callStack) {
    return callStack.replace(/\(.*?\)/g, '');
}