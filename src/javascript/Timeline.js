// Time-line顯示
export default function drawTimeLine (pages, channels, rangeArray) {
    // pages = 刻度 (end_time / 10)   10秒內的刻度 ，如果有700秒 則顯示70個刻度
    console.log('pages', pages)
    for (let j = 0; j < channels; j++) {

        var childContainerId = "timeline-child-container-" + (j + 1);
        var childContainerSelector = "#" + childContainerId
        var container = document.querySelector("#timeline-container");
        var oldTimeLine = container.querySelector(childContainerSelector);
        if (oldTimeLine) {
            container.removeChild(oldTimeLine);
        }
        // second height
        var div = document.createElement("div");
        div.setAttribute("id", childContainerId);
        // div.setAttribute("style", "position: absolute;top: " + 129.5 * j + "px;");
        container.appendChild(div)
        var childRangeArray = rangeArray[j];
        // console.log('childRangeArray',childRangeArray[0])
        var padding = 80;
        var startX = padding;
        var length = 1500;
        var endX = startX + length;
        console.log('startx', endX)
        var ns = "http://www.w3.org/2000/svg";
        var div = document.createElement("div");
        div.setAttribute("class", "timeline");
        var svg = document.createElementNS(ns, "svg");
        svg.setAttribute("width", endX + padding);
        div.appendChild(svg);
        var g2 = document.createElementNS(ns, "g");
        g2.setAttribute("transform", "translate(0,55)");
        g2.setAttribute("fill", "none");
        g2.setAttribute("font-size", "10");
        g2.setAttribute("font-family", "sans-serif");
        g2.setAttribute("text-anchor", "middle");
        svg.appendChild(g2);
        var path1 = document.createElementNS(ns, "path");
        path1.setAttribute("stroke", "#000");
        path1.setAttribute("d", "M" + startX + ",6V0.5H" + endX + "V6");
        g2.appendChild(path1);
        for (var i = 0; i <= pages; i++) {
            var g5 = document.createElementNS(ns, "g");
            g5.setAttribute("opacity", "1");
            g5.setAttribute("transform", "translate(" + ((length / pages) * (i) + padding) + ",0)");
            g2.appendChild(g5);
            var line3 = document.createElementNS(ns, "line");
            line3.setAttribute("stroke", "#000");
            line3.setAttribute("y2", "6");
            g5.appendChild(line3);
            var text3 = document.createElementNS(ns, "text");
            text3.setAttribute("fill", "#000");
            text3.setAttribute("y", "20");
            text3.setAttribute("dy", "0.71em");
            text3.textContent = i * 10;
            g5.appendChild(text3);
        }
        var colorArray = ['255, 0, 0', '255, 165, 0', '255, 255, 0', '0, 255, 0', '0, 127, 255', '0, 0, 255', '139, 0, 255']
        for (var i = 0; i < childRangeArray.length; i++) {
            // childRangeArray 有兩個[start:0,end:1000]
            var range = childRangeArray[i];
            // console.log('range',childRangeArray[0])
            var g1 = document.createElementNS(ns, "g");
            svg.appendChild(g1);
            var rect1 = document.createElementNS(ns, "rect");
            rect1.setAttribute("x", padding + range.start / (5120 * pages) * length);
            rect1.setAttribute("y", "30");
            rect1.setAttribute("width", (range.end - range.start) / (5120 * pages) * length);
            rect1.setAttribute("height", "20");
            rect1.setAttribute("style", "fill: rgb(" + colorArray[i % colorArray.length] + ")");
            g1.appendChild(rect1);
            if (range.start % 5120 > 200) {
                var g5 = document.createElementNS(ns, "g");
                g5.setAttribute("opacity", "1");
                g5.setAttribute("transform", "translate(" + (padding + range.start / (5120 * pages) * length) + ",0)");
                g2.appendChild(g5);
                var line3 = document.createElementNS(ns, "line");
                line3.setAttribute("stroke", "#000");
                line3.setAttribute("y2", "6");
                g5.appendChild(line3);
                var text3 = document.createElementNS(ns, "text");
                text3.setAttribute("fill", "#000");
                text3.setAttribute("y", "20");
                text3.setAttribute("dy", "0.71em");
                text3.textContent = Math.round(range.start / 5120 * 100) / 10;
                g5.appendChild(text3);
            }
            if (range.end % 5120 > 200) {
                var g5 = document.createElementNS(ns, "g");
                g5.setAttribute("opacity", "1");
                g5.setAttribute("transform", "translate(" + (padding + range.end / (5120 * pages) * length) + ",0)");
                g2.appendChild(g5);
                var line3 = document.createElementNS(ns, "line");
                line3.setAttribute("stroke", "#000");
                line3.setAttribute("y2", "6");
                g5.appendChild(line3);
                var text3 = document.createElementNS(ns, "text");
                text3.setAttribute("fill", "#000");
                text3.setAttribute("y", "20");
                text3.setAttribute("dy", "0.71em");
                text3.textContent = Math.round(range.end / 5120 * 100) / 10;
                g5.appendChild(text3);
            }
        }
        var childContainer = document.querySelector(childContainerSelector);

        document.querySelector(childContainerSelector).appendChild(div);
    }
}