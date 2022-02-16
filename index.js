/*

This file contains the added methods and properties used to extend the required modules.
Along with a bunch of examples on how the modules can be used.

Reference:
- https://github.com/jsdom/jsdom
- https://github.com/taoqf/node-html-parser
*/

const fs = require('fs');
const path = require('path');
const HTMLParser = require('node-html-parser');
const {HTMLElement} = require('node-html-parser');
const HTML = require('html');
const xlsx = require('xlsx');


//*** Extending modules ***/
// Parse html file to HTMLElement
// parameters: path to the html file, include .html
// returns: HTMLElement
HTMLParser.loadFile = function (filePath){
    let file = fs.readFileSync(filePath);
    return HTMLParser.parse(file)
}

// Pretty prints html from HTMLElement
// parameters: N/A
// returns: String of HTMLElement
HTMLElement.prototype.prettyPrint = function(){
    return HTML.prettyPrint(this.outerHTML, {indent_size: 2})
}




//*** Function to run  ***/
// Step 1: read excel sheet and print json object

let excelFile = path.join(__dirname, "/sample_data", "HCTP July19 Master_FINAL (3.15.21).xlsx");
let workbook = xlsx.readFile(excelFile);

// Find sheet index based on name
let sheet;

for(i=0; i< workbook.SheetNames.length; i++){
    if(workbook.SheetNames[i] == 'Business Library'){
        sheet = workbook.Sheets[workbook.SheetNames[i]];
        break;
    }
}


let json = xlsx.utils.sheet_to_json(sheet);
//console.log(json);

json.forEach( item => {
    if ('Title' in item){
        let htmlString;
        let title = item["Title"];
        //console.log(item["Title"])
        if ('Brightcove ID' in item){
            // Use video template
            htmlString = videoTemplate(item);

        }else{
            // Use PDF template(s)
            htmlString = pdfEmbedTemplate(item);
        }
        let html = HTMLParser.parse(htmlString);
        
        if (!fs.existsSync(path.join(__dirname, "/sample_data", "modified"))){
            fs.mkdirSync(path.join(__dirname, "/sample_data", "modified"))
        }

        let part = "";

        if (title.toLowerCase().includes("part 1")) {
            part = "-1";
        } else if (title.toLowerCase().includes("part 2")){
            part = "-2";
        } else if (title.toLowerCase().includes("part 3")){
            part = "-3";
        }

        let fileName = title.split(",")[0].replace(/ /g,"_").toLowerCase() + part + ".html";
        console.log(fileName);

        fs.writeFileSync(path.join(__dirname, "/sample_data", "/modified", fileName), html.prettyPrint());
    }

})


function videoTemplate(item){
    let markup = 
    `<!DOCTYPE html>
    <html lang="en">
      
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/bootstrap-4.3.1/css/bootstrap.min.css">
        <!-- Font Awesome CSS -->
        <link rel="stylesheet" href="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/fontawesome-free-5.9.0-web/css/all.min.css">
        <!-- Template CSS -->
        <link rel="stylesheet" href="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/css/styles.min.css">
        <link rel="stylesheet" href="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/css/custom.css">
        <link rel="stylesheet" href="../course_assets/custom.css">
        <title>${item["Title"]}</title>
      </head>
      
      <body>
        <div class="container-fluid">
          <div class="fullscreen-splash bg-img-wrapper">
            <img src="../course_assets/img" alt="">
            <div class="overlay-content">
              <div class="bg-darkness">
                <hr>
                 <h1>${item["Title"]}</h1>
    
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="video-panel">
                <div class="row">
                  <div class="col-10 offset-1">
                  <p></p>
                    <div class="video-wrapper">
                      <div class="embed-responsive">
                        <video-js data-account="1545417548001" data-player="9jkCQOsC6h" data-embed="default"
                        controls="" data-video-id="${item["Brightcove ID"]}" data-playlist-id="" data-application-id=""
                        class="vjs-fluid"></video-js>
                        <script src="https://players.brightcove.net/1545417548001/9jkCQOsC6h_default/index.min.js"></script>
                      </div>
                      <div class="video-text"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12">
              <footer>
                <!-- <p>© [Client] [Year]</p> -->
                <p>
                  <img src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/img/iin_logo_icon-01.svg"
                  alt="Logo for Institute for Integrative Nutrition">
                </p>
              </footer>
            </div>
          </div>
        </div>
        <script src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/jquery/jquery-3.4.1.min.js">
    </script>
        <script src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/popper-js/popper.min.js"></script>
        <script src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/bootstrap-4.3.1/js/bootstrap.min.js">
    </script>
        <!-- Socratic Reflection -->
        <script src="/shared/custom_widgets/d2l/assets/third_party/valence/libVal.min.js"></script>
        <script src="/shared/custom_widgets/d2l/widgets/socratic_questioning/js/main.min.js"></script>
        <!-- Template JavaScript -->
        <script src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/js/scripts.min.js"></script>
      </body>
    
    </html>`;

    return markup
}

function pdfEmbedTemplate(item){
    let markup = 
    `<!doctype html>
    <html lang="en">
    
    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
        <!-- Bootstrap CSS -->
        <link rel="stylesheet"
            href="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/bootstrap-4.3.1/css/bootstrap.min.css">
        <!-- Font Awesome CSS -->
        <link rel="stylesheet"
            href="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/fontawesome-free-5.9.0-web/css/all.min.css">
        <!-- Template CSS -->
        <link rel="stylesheet" href="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/css/styles.min.css">
        <link rel="stylesheet" href="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/css/custom.css">
        <link rel="stylesheet" href="../course_assets/custom.css">
    
        <title>${item["Title"]}</title>
    </head>
    
    <body>
        <div class="container-fluid">
            <div class="fullscreen-splash bg-img-wrapper">
                <img src="../course_assets/img/Library_Banner.jpg" alt="">
                <div class="overlay-content">
                    <div class="bg-darkness">
                        <hr>
                        <h1>${item["Title"]}</h1>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="video-panel">
                        <div class="row">
                            <div class="col-10 offset-1">
                                <div class="splash-95" id="adobe-dc-view"></div>
                                <p>
                                    <script src="https://documentcloud.adobe.com/view-sdk/main.js"></script>
                                    <script type="text/javascript">
                                        document.addEventListener("adobe_dc_view_sdk.ready", function () {
                                            var adobeDCView = new AdobeDC.View({
                                                clientId: "bba6ebfe7f8b44ea8480842ed46aadec",
                                                divId: "adobe-dc-view"
                                            });
                                            adobeDCView.previewFile({
                                                content: {
                                                    location: {
                                                        url: "https://learnwithiin.com/d2l/...${item["Title"]}.pdf"
                                                    }
                                                },
                                                metaData: {
                                                    fileName: "${item["Title"]}.pdf"
                                                }
                                            }, {
                                                embedMode: "SIZED_CONTAINER"
                                            });
                                        });
                                    </script>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="col-12">
                <footer>
                    <!-- <p>© [Client] [Year]</p> -->
                    <p><img src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/img/iin_logo_icon-01.svg"
                            alt="Logo for Institute for Integrative Nutrition"></p>
                </footer>
            </div>
        </div>
    
        </div>
        <script src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/jquery/jquery-3.4.1.min.js">
        </script>
        <script src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/popper-js/popper.min.js">
        </script>
        <script
            src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/bootstrap-4.3.1/js/bootstrap.min.js">
        </script>
        <script src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/thirdpartylib/pdf-object/pdf.js"></script>
        <!-- Socratic Reflection -->
        <script src="/shared/custom_widgets/d2l/assets/third_party/valence/libVal.min.js"></script>
        <script src="/shared/custom_widgets/d2l/widgets/socratic_questioning/js/main.min.js"></script>
        <!-- Template JavaScript -->
        <script src="/shared/HTML-Template-Library/HTML-Templates-IIN/_assets/js/scripts.min.js"></script>
    
    </body>
    
    </html>`;
    return markup
}

function pdfLinkTemplate(item){
    let markup = 
    ``;
    return markup
}

//*** Examples ***/

//* Add load file and pretty print body html
// let filePath = path.join(__dirname, "/sample_data", "sample.html");
// let html = HTMLParser.loadFile(filePath);
// let body = html.querySelector('body');
// console.log(body.prettyPrint())

//* Read h1 tag and update title and create new html file (will overwrite files)
// let filePath = path.join(__dirname, "/sample_data", "sample.html");
// let html = HTMLParser.loadFile(filePath);
// let h1 = html.querySelector('body').querySelector('h1');
// html.querySelector('title').textContent = h1.textContent;
// fs.writeFileSync(path.join(__dirname, "/sample_data", "sample_new.html"), html.prettyPrint())

//* Add class to all p elements
// let filePath = path.join(__dirname, "/sample_data", "sample.html");
// let html = HTMLParser.loadFile(filePath);
// let elements = html.querySelectorAll('p');
// elements.forEach(element => {
//     element.classList.add("addClass");
// });
// console.log(html.prettyPrint())

//* Parse multiple files
// let files = fs.readdirSync(path.join(__dirname, "/sample_data"));
// files.forEach(file => {
//     let filePath = path.join(__dirname, "/sample_data", file);
//     if(path.extname(filePath) == ".html"){
//         let html = HTMLParser.loadFile(filePath);
//         console.log(html.prettyPrint())
//     }
// });

//* Modify and create multiple files
// let files = fs.readdirSync(path.join(__dirname, "/sample_data"));
// let updatedFiles = [];
// let skippedFiles = [];
// files.forEach(file => {
//     let filePath = path.join(__dirname, "/sample_data", file);
//     if(path.extname(filePath) == ".html"){
//         let html = HTMLParser.loadFile(filePath);
//         let h1 = html.querySelector('body').querySelector('h1');
//         html.querySelector('title').textContent = h1.textContent;
//         // create the ./sample_date/modified directory if it doesn't exist
//         if (!fs.existsSync(path.join(__dirname, "/sample_data", "modified"))){
//             fs.mkdirSync(path.join(__dirname, "/sample_data", "modified"))
//         }
//         fs.writeFileSync(path.join(__dirname, "/sample_data", "/modified", file), html.prettyPrint())
//         updatedFiles.push(file);
//     }else{
//         skippedFiles.push(file);
//     }
// });
// console.log("")
// console.log("The following files were updated:")
// console.log(updatedFiles);
// console.log("\n**********************\n");
// console.log("The following files were skipped:")
// console.log(skippedFiles);
// console.log("")

//* Modify multiple html files based on data from Excel sheet
// let excelFile = path.join(__dirname, "/sample_data", "sample_sheet.xlsx");
// let workbook = xlsx.readFile(excelFile);
// let sheet = workbook.Sheets[workbook.SheetNames[0]];
// let json = xlsx.utils.sheet_to_json(sheet);
// let files = fs.readdirSync(path.join(__dirname, "/sample_data"));
// files.forEach(file => {
//     let filePath = path.join(__dirname, "/sample_data", file);
//     if(path.extname(filePath) == ".html"){
//         let html = HTMLParser.loadFile(filePath);
//         let normTile = new String(html.querySelector('title').textContent).replace(/\s+/g, '').toLowerCase().normalize();
//         json.forEach( item => {
//             // If using filename as the selector, without file extension -> if(path.parse(file).name == item["File Selector"])
            
//             // Or by using html element, needs to normalize the selector
//             let normFileSelector = new String(item["File Selector"]).replace(/\s+/g, '').toLowerCase().normalize(); 
//             if(normTile == normFileSelector){
//                 elementSelector = item["Element Selector"];
//                 html.querySelector('video-js[data-account='+ elementSelector + ']').setAttribute('data-video-id',item["Updates"])
//             }
//         })
//         console.log(html.prettyPrint());
//     }
// })

//* Create HTMLElement add it to the body
// let filePath = path.join(__dirname, "/sample_data", "sample.html");
// let html = HTMLParser.loadFile(filePath);
// let body = html.querySelector('body');
// let div = new HTMLElement('div', {class: 'className'}, '');
// div.appendChild(new HTMLElement('p', '','')).textContent = "Hello World!!";
// body.appendChild(div)
// console.log(html.prettyPrint())