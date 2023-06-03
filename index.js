async function getFile(filename) {
    var response = await fetch(filename);
    var file = await response.text();
    return JSON.parse(file);
}

function updatePage(info) {
    if(!info.search) {
        document.getElementById("pageInput").value = info.page + 1;

        document.getElementById("mainContent").innerHTML = "";
        var div = document.createElement("div");
        div.dataset.page = info.page;

        for(let i = 0; i < info.data[info.page].length; i++) {
            var el = document.createElement("p");
            el.setAttribute("class", "box box-center box-content");
            el.dataset.index = i;
            let obj = info.data[info.page][i];
            if(info.tranlation === "none") {
                el.innerHTML = `${obj.text}`;
            }
            else {
                el.innerHTML = `${obj.text}<p class="box-content-2">${obj[info.tranlation]}</p>`;
            }
            div.appendChild(el);
        }

        document.getElementById("mainContent").appendChild(div);
        document.getElementById("mainContent").scrollTo(0, 0);
    }
    else {
        document.getElementById("pageInput").value = info.pageSearch + 1;

        document.getElementById("mainContent").innerHTML = "";

        var el = document.createElement("p");
        el.setAttribute("class", "box-2 box-center box-content");
        el.innerHTML = `X`;
        el.addEventListener("click", () => {
            exitSearch(info, true);
        });
        document.getElementById("mainContent").appendChild(el);

        var div = document.createElement("div");
        div.dataset.page = info.pageSearch;


        for(let i = 0; i < info.dataSearch[info.pageSearch].length; i++) {
            var el = document.createElement("p");
            el.setAttribute("class", "box-2 box-center box-content");
            el.dataset.index = i;

            let obj = info.dataSearch[info.pageSearch][i];
            if(info.tranlation === "none") {
                el.innerHTML = `${obj[2].text}`;
            }
            else {
                el.innerHTML = `${obj[2].text}<p class="box-content-2">${obj[2][info.tranlation]}</p>`;
            }

            if(obj.section === obj.subsection || obj.subsection === null) {
                el.innerHTML += `<p class="note">${obj[2].writer}, ${obj[2].section}</p>`

            }
            else {
                el.innerHTML += `<p class="note">${obj[2].writer}, ${obj[2].section}, ${obj[2].subsection}</p>`
            }

            el.addEventListener("click", () => {
                exitSearch(info, false, obj[0], obj[1]);
            });
            div.appendChild(el);
        }

        document.getElementById("mainContent").appendChild(div);
        document.getElementById("mainContent").scrollTo(0, 0);
    }
}


function nextPage(info) {
    if(!info.search) {
        if(info.data[info.page + 1] !== undefined) {
            info.page++;
            updatePage(info);
        }
    }
    else {
        if(info.dataSearch[info.pageSearch + 1] !== undefined) {
            info.pageSearch++;
            updatePage(info);
        }
    }
}

function prevPage(info) {
    if(!info.search) {
        if(info.data[info.page - 1] !== undefined) {
            info.page--;
            updatePage(info);
        }
    }
    else {
        if(info.dataSearch[info.pageSearch - 1] !== undefined) {
            info.pageSearch--;
            updatePage(info);
        }
    }
}

function exitSearch(info, cancel, i, j) {
    info.search = false;

    document.getElementById("searchInput").value = "";

    if(!cancel) {
        info.page = i;
        updatePage(info);
        var el = document.querySelector(`[data-page="${i}"] > [data-index="${j}"]`)

        el.classList.remove("box");
        el.classList.add("box-2");
        el.scrollIntoView();

        /*
        setTimeout(() => {
            el.classList.add("box");
            el.classList.remove("box-3");
        }, 5000);
        */
    }
    else {
        updatePage(info);
    }
}

function normalizePunjabi(val) {
    return val.replaceAll("ਆ", "ਅ")
    .replaceAll("ਇ", "ੲ")
    .replaceAll("ਈ", "ੲ")
    .replaceAll("ਉ", "ੳ")
    .replaceAll("ਊ", "ੳ")
    .replaceAll("ਏ", "ੲ")
    .replaceAll("ਐ", "ਅ")
    .replaceAll("ਓ", "ੳ")
    .replaceAll("ਔ", "ਅ");
}

function createSearch(info, value, mode) {
    info.search = true;
    info.pageSearch = 0;
    info.dataSearch = [[]];
    var k = 0;

    for(let i = 0; i < info.data.length; i++) {
        for(let j = 0; j < info.data[i].length; j++) {
            switch(mode) {
                case "fullWord":
                    if(info.data[i][j].text.includes(value)) {
                        if(info.dataSearch[k].length === 15) k++;
                        if(info.dataSearch[k] === undefined) info.dataSearch[k] = [];
                        info.dataSearch[k].push([i, j, info.data[i][j]]);
                    }
                    break;
                case "startsWithLetter":
                    var text = info.data[i][j].text.split(" ").map((val) => normalizePunjabi(val[0])).join("");
                    if(text.includes(value)) {
                        if(info.dataSearch[k].length === 15) k++;
                        if(info.dataSearch[k] === undefined) info.dataSearch[k] = [];
                        info.dataSearch[k].push([i, j, info.data[i][j]]);
                    }
                    break;
            }
        }
    }

    updatePage(info);
}

var info;
(async () => {
    info = {
        tranlation: "Bhai Manmohan Singh Punjabi",
        data: [],
        page: 0,

        search: false,
        dataSearch: undefined,
        pageSearch: undefined,

        sections: await getFile("data/sections.json"),
    };

    for (let filename of await getFile("data/full.json")) {
        info.data = info.data.concat(await getFile("data/" + filename));
    }

    updatePage(info);

    document.getElementById("prevButton").addEventListener("click", () => prevPage(info));
    document.getElementById("nextButton").addEventListener("click", () => nextPage(info));

    document.getElementById("searchInput").addEventListener("input", () => {
        createSearch(info, document.getElementById("searchInput").value, document.getElementById("searchModeSelector").value);
    });

    document.getElementById("searchModeSelector").addEventListener("change", () => {
        if(info.search) {
            createSearch(info, document.getElementById("searchInput").value, document.getElementById("searchModeSelector").value);
        }
    });

    document.getElementById("menuButton").addEventListener("click", () => {
        document.getElementById("menu").classList.toggle("hidden");
        document.getElementById("menuButton").classList.toggle("menu");
    });

    document.getElementById("tranlationSelector").addEventListener("change", () => {
        info.tranlation = document.getElementById("tranlationSelector").value;
        updatePage(info);
    });

    document.getElementById("pageInput").addEventListener("input", () => {
        if(document.getElementById("pageInput").value === "") return;
        var num = parseInt(document.getElementById("pageInput").value);
        if(num <= 0 || num === NaN) return;
        if(!info.search) {
            if(num >= info.data.length) return;
            info.page = num - 1;
            updatePage(info);
        }
        else {
            if(num >= info.dataSearch.length) return;
            info.pageSearch = num - 1;
            updatePage(info);
        }
    });

    for (let [section, i] of info.sections) {
        document.getElementById("sectionSelector").innerHTML += `<option value="${i + 1}">${section} - ${i + 1}</option>`;
    }

    document.getElementById("sectionSelector").addEventListener("change", () => {
        info.search = false;
        info.page = parseInt(document.getElementById("sectionSelector").value);
        document.getElementById("sectionSelector").value = "";
        updatePage(info);
    });

    document.getElementById("keyboardButton").addEventListener("click", () => {
        document.getElementById("keyboardButton").classList.toggle("menu");
        document.getElementById("keyboard").classList.toggle("hidden");
        document.getElementById("searchInput").readOnly = !document.getElementById("searchInput").readOnly;
    });

    document.querySelectorAll("#keyboard-type").forEach((el) => {
        el.addEventListener("click", () => {
            document.getElementById("searchInput").value += el.innerText;
            createSearch(info, document.getElementById("searchInput").value, document.getElementById("searchModeSelector").value);
        });
    });

    document.getElementById("keyboard-backspace").addEventListener("click", () => {
        var value = document.getElementById("searchInput").value;
        document.getElementById("searchInput").value = value.substring(0, value.length -1);
        createSearch(info, document.getElementById("searchInput").value, document.getElementById("searchModeSelector").value);
    });

    document.getElementById("keyboard-space").addEventListener("click", () => {
        document.getElementById("searchInput").value = "";
        createSearch(info, document.getElementById("searchInput").value, document.getElementById("searchModeSelector").value);
    });
})();

var isPwa = true;

if("serviceWorker" in navigator && isPwa) {
    navigator.serviceWorker.register("sw.js");
    window.addEventListener("beforeinstallprompt", (e) => {
        document.getElementById("pwaInstallInput").classList.remove("hidden");
        document.getElementById("pwaInstallInput").addEventListener("click", async () => {
            var choice = await e.prompt();
            if(choice.outcome === "accepted") document.getElementById("pwaInstallInput").classList.add("hidden");
            else {
                location.reload();
            }
        });
    });

    if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) && !navigator.standalone) {
        document.getElementById("pwaInstallInputSafari").classList.remove("hidden");
    }

}
