/* global d3 */
function resize() {}

function init(data) {


  var yearSelected = 1997;
  var vocalRegisterThresh = 6;
  var dataWeekWeighted = data[0];
  var dataSongsByYear = null;
  var songCriteriaSelected = "falsetto_percent"

  var dataSongsByYearNestTotal = d3.nest().key(function(d){
      return d.year;
    })
    .sortValues(function(a,b){
      return +b.points - +a.points
    })
    .entries(data[0])

  function fitsNumeratorCriteria(d){
    var fits = false;

    if(songCriteriaSelected == "falsetto_percent"){
      if(d["falsetto"] > 0){
        fits = true;
      }
    }

    if(songCriteriaSelected == "register_percent"){
      if(d["register"] > vocalRegisterThresh){
        fits = true;
      }
    }

    if(songCriteriaSelected == "either_percent"){
      if(d["register"] > vocalRegisterThresh || d["falsetto"] > 0){
        fits = true;
      }
    }

    return fits;
  }

  function getSongMissing(d){
    var isGood = true;
    if(d.falsetto == "NULL" || d.initial_match == "False"){
      isGood = false;
    }
    return isGood;
  }

  function getSongFiltered(d){
    var isGood = true;

    if(d.falsetto == "NULL" || d.initial_match == "False"){
      isGood = false;
    }
    if(hipHopFilter && isGood && d.genre == "Rap/Hip hop"){
      isGood = false;
    }
    if(singingFilter && isGood && +d.spoken == 10){
      isGood = false;
    }
    if(singingFilter && isGood && +d.register == 0){
      isGood = false;
    }
    if(maleFilter && isGood && ["male","duet"].indexOf(d.gender) == -1){
      isGood = false;
    }
    if(top10Filter && isGood && +d.peak_rank > 10){
      isGood = false;
    }
    return isGood;
  }

  function calculatePercents(newData){

    for (var year in newData){
      var falsettoCount = 0
      var vocalRegisterCount = 0
      var eitherCount = 0
      var denominatorCount = 0;

      for (var song in newData[year].values){

        var isGood = getSongFiltered(newData[year].values[song]);

        if(isGood){
          denominatorCount = denominatorCount + 1;
          if(newData[year].values[song]["falsetto"] > 0){
            falsettoCount = falsettoCount + 1;
          }

          vocalRegisterCount = vocalRegisterCount + +newData[year].values[song]["register"];

          // if(newData[year].values[song]["register"] > vocalRegisterThresh){
          //   vocalRegisterCount = vocalRegisterCount + 1;
          // }
          // if(newData[year].values[song]["register"] > vocalRegisterThresh || newData[year].values[song]["falsetto"] > 0){
          //   eitherCount = eitherCount + 1;
          // }
        }
      }

      newData[year].falsetto_percent = falsettoCount/denominatorCount
      newData[year].register_percent = vocalRegisterCount/denominatorCount
      newData[year].either_percent = eitherCount/denominatorCount

    }
    dataSongsByYear = d3.map(newData,function(d){return d.key})
    buildLineChart(newData);
    buildScatterPlot(newData);

  }

  function buildScatterPlot(dataForChart){
    var container = d3.select(".scatter-plot");
    container.selectAll("svg").remove();

    var margin = {top: 30, right: 30, bottom: 30, left: 30}
    var width = 250 - margin.left - margin.right; // Use the window's width
    var height = 250 - margin.top - margin.bottom; // Use the window's height

    function polygon(d) {
      return "M" + d.join("L") + "Z";
    }

    var extentPercent = d3.extent(dataForChart,function(d){
      return d["falsetto_percent"];
    })

    var extentPercentTwo = d3.extent(dataForChart,function(d){
      return d["register_percent"];
    })


    var xScale = d3.scaleLinear().domain(extentPercentTwo).range([0,width]);
    var yScale = d3.scaleLinear().domain(extentPercent).range([height,0]);

    var voronoi = d3.voronoi()
      .x(function(d) { return xScale(d["register_percent"]); })
      .y(function(d) { return yScale(d["falsetto_percent"]); })
      .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]])
      ;

    var svg = container.append("svg")
      .attr("width",width+margin.left+margin.right)
      .attr("height",height+margin.top+margin.bottom)
      .datum(dataForChart.sort(function(a,b){
        return +a.key - +b.key
      }))
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class","axis x")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .append("text")
      .attr("x",width/2)
      .attr("y",25)
      .text("falsetto")
      .attr("text-anchor","middle")
      ;

    svg.append("g")
      .attr("class","axis")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .append("text")
      .attr("x",width/2 - 50)
      .attr("y",25)
      .attr("class","sub")
      .text("fewer songs")
      .attr("text-anchor","end")
      ;

    svg.append("g")
      .attr("class","axis")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .append("text")
      .attr("x",width/2 + 50)
      .attr("y",25)
      .attr("class","sub")
      .text("more songs")
      .attr("text-anchor","start")
      ;

    svg.append("g")
      .attr("class","axis y")
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .append("text")
      .attr("x",0)
      .attr("y",height/2)
      .text("register")
      ;

    svg.append("g")
      .attr("class","axis y")
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .append("text")
      .attr("class","sub")
      .attr("x",0)
      .attr("y",height/2 - 20)
      .text("higher")
      ;

    svg.append("g")
      .attr("class","axis y")
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .append("text")
      .attr("class","sub")
      .attr("x",0)
      .attr("y",height/2 + 17)
      .text("lower")
      ;

    var circles = svg
      .append("g")
      .attr("class","circles")
      .selectAll("circle")
      .data(dataForChart)
      .enter()
      .append("circle")
      .attr("cx",function(d){
        return xScale(d["register_percent"])
      })
      .attr("cy",function(d){
        return yScale(d["falsetto_percent"]);
      })
      .attr("r",4)
      ;

    var textPoints = svg
      .append("g")
      .selectAll("g")
      .data(dataForChart)
      .enter()
      .append("g")
      .attr("transform",function(d){
        return "translate("+xScale(d["register_percent"])+","+yScale(d["falsetto_percent"])+")"
      })
      ;

    var textBg = textPoints
      .append("text")
      .attr("class","text-points-bg")
      .attr("x",0)
      .attr("y",0)
      .html(function(d){
        return "&rsquo;"+d.key.slice(-2);
      })

    var text = textPoints
      .append("text")
      .attr("class","text-points")
      .attr("x",0)
      .attr("y",0)
      .html(function(d){
        return "&rsquo;"+d.key.slice(-2);
      })



    svg
      .append("g")
      .attr("class","voronoi")
      .selectAll("path")
      .data(function(d){
        return voronoi.polygons(dataForChart);
      })
      .enter()
      .append("path")
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      .on("mouseover",function(d){
        var year = +d.data.key;


        textPoints.sort(function(a,b){
          a.sort = 0;
          b.sort = 0
          if (a.key == +year){
            a.sort = 1;
          }
          if (b.key == +year){
            b.sort = 1;
          }
          return a.sort - b.sort;
        })

        textPoints
          .select(".text-points")
          .style("font-size",function(d){
            if(d.key == year){
              return "18px";
            }
            return null;
          })

        textPoints
          .select(".text-points-bg")
          .style("font-size",function(d){
            if(d.key == year){
              return "18px";
            }
            return null;
          })
          .style("display",function(d){
            if(d.key == year){
              return "block";
            }
            return null;
          })

        d3.select(".line-hover").text(+d.data.key + " " + Math.round(d.data[songCriteriaSelected]*100) + "%")
      })
      .on("click",function(d){
        var year = +d.data.key;

        textPoints.style("fill",function(d){
          if(d.key == year){
            return "red";
          }
          return null;
        })
        yearSelected = +d.data.key;
        console.log(yearSelected);
        buildSongArray(dataSongsByYear,yearSelected)
      })


  }

  function buildSongArray(dataForChart,year){
    var container = d3.select(".song-container");
    container.selectAll("div").remove();

    var songRows = container.selectAll("div")
      .data(dataForChart.get(year).values)
      .enter()
      .append("div")
      .attr("class","song-row")
      .classed("missing",function(d){
        return !getSongMissing(d);
      })
      .classed("filtered",function(d){
        return !getSongFiltered(d);
      })
      .classed("numerator",function(d){
        return fitsNumeratorCriteria(d)
      })
      .on("mouseover",function(d){
        d3.select(this).select(".song-overlay").style("display","block");
      })
      .on("mouseout",function(d){
        d3.select(this).select(".song-overlay").style("display",null);
      })

    songRows
      .append("p")
      .attr("class","song-text")
      .text(function(d,i){
        return (i+1)+". "+d.song_title.slice(0,25);
      })
      ;

    songRows.append("p")
      .attr("class","song-overlay")
      .style("color",function(d){
        if(d.falsetto > 0){
          return "red";
        }
        return null
      })
      .text(function(d,i){
        return (i+1)+". "+d.song_title + " - " + d.artist_name;
      })

  }

  function buildLineChart(dataForChart){

    console.log("building line chart");

    var container = d3.select(".line-chart-container");

    container.selectAll("svg").remove();

    var margin = {top: 30, right: 30, bottom: 30, left: 30}
    var width = 250 - margin.left - margin.right; // Use the window's width
    var height = 250 - margin.top - margin.bottom; // Use the window's height

    function polygon(d) {
      return "M" + d.join("L") + "Z";
    }

    var extentPercent = d3.extent(dataForChart,function(d){
      return d[songCriteriaSelected];
    })

    var extentYear = d3.extent(dataForChart,function(d){
      return +d.key;
    })

    var xScale = d3.scaleLinear().domain(extentYear).range([0,width]);
    var yScale = d3.scaleLinear().domain(extentPercent).range([height,0]);

    var line = d3.line()
      .x(function(d) { return xScale(+d.key); })
      .y(function(d) { return yScale(d[songCriteriaSelected]); });

    var voronoi = d3.voronoi()
      .x(function(d) { return xScale(+d.key); })
      .y(function(d) { return yScale(d[songCriteriaSelected]); })
      .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]])
      ;

    var svg = container.append("svg")
      .attr("width",width+margin.left+margin.right)
      .attr("height",height+margin.top+margin.bottom)
      .datum(dataForChart.sort(function(a,b){
        return +a.key - +b.key
      }))
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class","axis x")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .append("text")
      .attr("x",width/2)
      .attr("y",25)
      .text("year")
      .attr("text-anchor","middle")
      ;

    var cross = {
      "falsetto_percent":"falsetto",
      "register_percent":"register",
    };

    svg.append("g")
      .attr("class","axis y")
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .append("text")
      .attr("x",0)
      .attr("y",height/2)
      .text(cross[songCriteriaSelected])
      ;

    var circles = svg
      .append("g")
      .attr("class","circles")
      .selectAll("circle")
      .data(dataForChart)
      .enter()
      .append("circle")
      .attr("cx",function(d){
        return xScale(d.key)
      })
      .attr("cy",function(d){
        return yScale(d[songCriteriaSelected]);
      })
      .attr("r",2)
      ;

    svg
      .append("g")
      .attr("class","lines")
      .append("path")
      .attr("d",function(d){
        return line(d);
      })

    svg
      .append("g")
      .attr("class","voronoi")
      .selectAll("path")
      .data(function(d){
        return voronoi.polygons(dataForChart);
      })
      .enter()
      .append("path")
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      .on("mouseover",function(d){
        var year = +d.data.key;
        circles.style("fill",function(d){
          if(d.key == year){
            return "red";
          }
          return null;
        })

        textPoints.style("display",function(d){
          if(d.key == year){
            return "block";
          }
          return null;
        })

        textPointsBg.style("display",function(d){
          if(d.key == year){
            return "block";
          }
          return null;
        })

        if(songCriteriaSelected == "falsetto_percent"){
          d3.select(".line-hover").text(+d.data.key + " " + Math.round(d.data[songCriteriaSelected]*100) + "%")
        }
        else{
          d3.select(".line-hover").text(+d.data.key + " " + Math.round(d.data[songCriteriaSelected]*100)/100)
        }

      })
      .on("click",function(d){
        yearSelected = +d.data.key;
        buildSongArray(dataSongsByYear,+d.data.key)
      })
      ;

    var textPointsBg = svg
      .append("g")
      .attr("class","text-points-hover text-points-hover-bg")
      .selectAll("text")
      .data(dataForChart)
      .enter()
      .append("text")
      .attr("x",function(d){
        return xScale(+d.key)
      })
      .attr("y",function(d){
        return yScale(d[songCriteriaSelected]) - 5;
      })
      .html(function(d){
        return "&rsquo;"+d.key.slice(-2);
      })

    var textPoints = svg
      .append("g")
      .attr("class","text-points-hover")
      .selectAll("text")
      .data(dataForChart)
      .enter()
      .append("text")
      .attr("x",function(d){
        return xScale(+d.key)
      })
      .attr("y",function(d){
        return yScale(d[songCriteriaSelected]) - 5;
      })
      .html(function(d){
        return "&rsquo;"+d.key.slice(-2);
      })

    buildSongArray(dataSongsByYear,yearSelected);
  }

  d3.select(".numerator").selectAll("p")
    .on("click",function(d){
      var valueSelected = d3.select(this).attr("value");
      songCriteriaSelected = valueSelected;
      calculatePercents(dataSongsByYearNestTotal);
    })

  d3.select(".year-selector").selectAll("p")
    .data(d3.range(1958,2019,1).reverse())
    .enter()
    .append("p")
    .text(function(d){
      return d;
    })
    .on("click",function(d){
      yearSelected = d;
      calculatePercents(dataSongsByYearNestTotal);
    })

  var hipHopFilter = false;
  var singingFilter = false;
  var maleFilter = false;
  var top10Filter = false;

  function setupBoxes(){
    d3.select("#no-hip-hop").property("disabled", false)
      .on("change", function() {
        if(this.checked){
          hipHopFilter = true;
        }
        else{
          hipHopFilter = false;
        }
        calculatePercents(dataSongsByYearNestTotal)
      });

    d3.select("#only-singing").property("disabled", false)
      .on("change", function() {
        if(this.checked){
          singingFilter = true;
        }
        else{
          singingFilter = false;
        }
        calculatePercents(dataSongsByYearNestTotal)
      });

    d3.select("#male-present").property("disabled", false)
      .on("change", function() {
        if(this.checked){
          maleFilter = true;
        }
        else{
          maleFilter = false;
        }
        calculatePercents(dataSongsByYearNestTotal)
      });

    d3.select("#top-10").property("disabled", false)
      .on("change", function() {
        if(this.checked){
          top10Filter = true;
        }
        else{
          top10Filter = false;
        }
        calculatePercents(dataSongsByYearNestTotal)
      });

  }


  setupBoxes();
  calculatePercents(dataSongsByYearNestTotal);
}

export default { init, resize };
