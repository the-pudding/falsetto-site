/* global d3 */
function resize() {}

function init(data) {

  var vocalRegisterThresh = 7;
  var dataWeekWeighted = data[0];
  var dataSongsByYear = null;
  var songCriteriaSelected = "falsetto_percent"

  var dataSongsByYearNest = d3.nest().key(function(d){
    return d.year;
  })
  .sortValues(function(a,b){
    return +b.points - +a.points
  })
  .entries(data[0])

  function calculatePercents(){
    for (var year in dataSongsByYearNest){
      var falsettoCount = 0
      var vocalRegisterCount = 0
      var eitherCount = 0
      for (var song in dataSongsByYearNest[year].values){
        if(dataSongsByYearNest[year].values[song]["falsetto"] == 1){
          falsettoCount = falsettoCount + 1;
        }
        if(dataSongsByYearNest[year].values[song]["register"] > vocalRegisterThresh){
          vocalRegisterCount = vocalRegisterCount + 1;
        }
        if(dataSongsByYearNest[year].values[song]["register"] > vocalRegisterThresh || dataSongsByYearNest[year].values[song]["falsetto"] == 1){
          eitherCount = eitherCount + 1;
        }
      }
      var base = dataSongsByYearNest[year].values.length;
      dataSongsByYearNest[year].falsetto_percent = falsettoCount/base
      dataSongsByYearNest[year].register_percent = vocalRegisterCount/base
      dataSongsByYearNest[year].either_percent = eitherCount/base

    }
    dataSongsByYear = d3.map(dataSongsByYearNest,function(d){return d.key})
  }
  function buildSongArray(dataForChart,year){
    console.log(dataForChart);
    var container = d3.select(".song-container");
    container.selectAll("div").remove();

    var songRows = container.selectAll("div")
      .data(dataForChart.get(year).values)
      .enter()
      .append("div")
      .attr("class","song-row")
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
      .style("color",function(d){
        if(d.falsetto > 0){
          return "red";
        }
        return null
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

    var container = d3.select(".line-chart-container");

    container.selectAll("svg").remove();

    var width = 200;
    var height = 200;

    function polygon(d) {
      return "M" + d.join("L") + "Z";
    }

    var extentPercent = d3.extent(dataForChart,function(d){
      return d[songCriteriaSelected];
    })

    var extentYear = d3.extent(dataForChart,function(d){
      return +d.key;
    })

    console.log(extentPercent);

    var xScale = d3.scaleLinear().domain(extentYear).range([0,width]);
    var yScale = d3.scaleLinear().domain(extentPercent).range([height,0]);

    var line = d3.line()
      .x(function(d) { return xScale(+d.key); })
      .y(function(d) { return yScale(d[songCriteriaSelected]); });

    var voronoi = d3.voronoi()
      .x(function(d) { return xScale(+d.key); })
      .y(function(d) { return yScale(d[songCriteriaSelected]); })
      .extent([[0, 0], [width, height]])
      ;

    var svg = container.append("svg")
      .attr("width",width)
      .attr("height",height)
      .datum(dataForChart.sort(function(a,b){
        return +a.key - +b.key
      }))

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
        console.log(+d.data.key);
      })
      .on("click",function(d){
        buildSongArray(dataSongsByYear,+d.data.key)
      })
      ;
  }

  d3.select(".numerator").selectAll("p")
    .on("click",function(d){
      var valueSelected = d3.select(this).attr("value");
      songCriteriaSelected = valueSelected;
      console.log(songCriteriaSelected);
      buildLineChart(dataSongsByYearNest);
    })

  d3.select(".viz").selectAll("p")
    .data(d3.range(1958,2019,1))
    .enter()
    .append("p")
    .text(function(d){
      return d;
    })
    .on("click",function(d){
      buildSongArray(dataSongsByYear,d);
    })

  calculatePercents();
  buildSongArray(dataSongsByYear,1997);
  buildLineChart(dataSongsByYearNest);
}

export default { init, resize };
