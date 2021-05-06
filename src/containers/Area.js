import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

function rect(x1, y1, x2, y2) {
  return `M ${x1},${y1} L ${x2},${y1} L ${x2},${y2} L ${x1},${y2} z`;
}

export default class Area extends Component {
  constructor(props) {
    super(props);
    this.markyData = {
      x: 100,
      y: 200,
      width: 200,
      height: 100,
      color: "rgba(0,0,0,0.1)",
    };
    this.initialized = false;
    this.orgSize = null;
    this.mount = false;
  }

  componentWillMount() {
    this.focused = false;
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown);
    this.mount = true;
  }

  componentDidUpdate() {
    if (this.initialized) {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      const svg = this.svg;

      this.xScale.range([0, width]);
      this.yScale.range([0, height]);

      this.base.selectAll("text").remove();

      this.base.selectAll("path").remove();

      this.updateArea();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
    this.mount = false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.forceUpdate();
    }
  }

  initializeSVG = (target) => {
    const self = this;
    this.target = target;
    const orgSize = this.target.originalSize();
    this.orgSize = orgSize;
    const { data } = this.props;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    const svg = this.svg;

    this.svgBase = d3.select(this.base);

    this.xScale = d3.scaleLinear().domain([0, orgSize.width]).range([0, width]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, orgSize.height])
      .range([0, height]);

    this.dragArea = d3.drag().on("start", function (d, i) {
      if (self.props.editable) {
        if (!d.selected && !d3.event.sourceEvent.shiftKey) {
          self.base.selectAll("path.rectangle").each((d) => {
            d.selected = false;
          });
        }
        d.selected = true;
        self.props.data.forEach((d) => {
          d.ox = self.xScale(d.x);
          d.oy = self.yScale(d.y);
        });
        self.updateSelection();
        const dragged = (d) => {
          self.props.data.forEach((d) => {
            if (d.selected) {
              d.ox += d3.event.dx;
              d.oy += d3.event.dy;
              d.x = self.xScale.invert(d.ox);
              d.y = self.yScale.invert(d.oy);
            }
          });
          self.updateSelection();
        };
        const ended = () => {
          self.props.data.forEach((d) => {
            delete d.ox;
            delete d.oy;
            d.x = parseInt(d.x);
            d.y = parseInt(d.y);
          });
          self.updateSelection();
          self.props.onAction({
            action: "update-area",
          });
        };
        d3.event.on("drag", dragged).on("end", ended);
      }
    });

    this.updateArea();

    this.dragMarky = d3.drag().on("start", function (d, i) {
      let dragCount = 0;
      const marky = d3.select(self.marky);
      let x = d3.event.x;
      let y = d3.event.y;
      self.markyData.x = d3.event.x;
      self.markyData.y = d3.event.y;
      self.markyData.width = 0;
      self.markyData.height = 0;
      const dragged = (d) => {
        dragCount++;
        x += d3.event.dx;
        y += d3.event.dy;
        self.markyData.width = x - self.markyData.x;
        self.markyData.height = y - self.markyData.y;
        marky
          .selectAll("path")
          .attr("visibility", "visible")
          .attr("d", (d) => rect(d.x, d.y, d.x + d.width, d.y + d.height));
      };
      const ended = () => {
        marky.selectAll("path").attr("visibility", "hidden");
        let x1 = self.xScale.invert(self.markyData.x);
        let y1 = self.yScale.invert(self.markyData.y);
        let x2 = self.xScale.invert(self.markyData.x + self.markyData.width);
        let y2 = self.yScale.invert(self.markyData.y + self.markyData.height);
        let t;
        t = x1;
        if (x2 < x1) {
          x1 = x2;
          x2 = t;
        }
        t = y1;
        if (y2 < y1) {
          y1 = y2;
          y2 = t;
        }
        if (!d3.event.sourceEvent.shiftKey && dragCount > 5) {
          self.props.onAction({
            action: "create-area",
            data: {
              x: parseInt(x1),
              y: parseInt(y1),
              width: parseInt(x2 - x1),
              height: parseInt(y2 - y1),
            },
          });
        } else {
          self.base.selectAll("path.rectangle").each((d) => {
            if (d3.event.sourceEvent.shiftKey && d.selected) return;
            d.selected =
              x1 <= d.x + d.width &&
              d.x <= x2 &&
              y1 <= d.y + d.height &&
              d.y <= y2;
          });
          self.updateSelection();
        }
      };
      d3.event.on("drag", dragged).on("end", ended);
    });

    if (this.props.editable) {
      svg.call(this.dragMarky);
    }

    this.updateMarky();

    this.initialized = true;
  };

  areaData = () => {
    return this.props.data;
  };

  updateSelection = () => {
    if (!this.initialized) return;

    if (this.props.editable) {
      this.base
        .selectAll("text.rectangle")
        .attr("x", (d) => this.xScale(d.x))
        .attr("y", (d) => this.yScale(d.y))
        .text((d) => d.title);
    }

    this.base
      .selectAll("path.rectangle")
      .attr("stroke", (d) => {
        if (this.props.editable) {
          if (d.selected) {
            return "rgba(255,0,0,1)";
          } else {
            return "rgba(0,255,0,1)";
          }
        }
        return "rgba(0,0,0,0)";
      })
      .attr("d", (d) =>
        rect(
          this.xScale(d.x),
          this.yScale(d.y),
          this.xScale(d.width) + this.xScale(d.x),
          this.yScale(d.height) + this.yScale(d.y)
        )
      );
  };

  updateArea = () => {
    if (!this.initialized) return;

    const self = this;

    if (this.props.editable) {
      this.base
        .selectAll("text.rectangle")
        .data(this.areaData())
        .enter()
        .append("text")
        .classed("rectangle", true)
        .attr("fill", "white")
        .attr("x", (d) => this.xScale(d.x))
        .attr("y", (d) => this.yScale(d.y))
        .text((d) => d.title);
    }

    this.base
      .selectAll("path.rectangle")
      .data(this.areaData())
      .enter()
      .append("path")
      .classed("rectangle", true)
      .attr("stroke", (d) => {
        if (this.props.editable) {
          if (d.selected) {
            return "rgba(255,0,0,1)";
          } else {
            return "rgba(0,255,0,1)";
          }
        }
        return "rgba(0,0,0,0)";
      })
      .attr("stroke-width", 1)
      .attr("fill", "rgba(0,0,0,0)")
      .attr("d", (d) =>
        rect(
          this.xScale(d.x),
          this.yScale(d.y),
          this.xScale(d.width) + this.xScale(d.x),
          this.yScale(d.height) + this.yScale(d.y)
        )
      )
      .on("click", function (d, i) {
        if (!self.props.editable) {
          //window.ElectronSendSync(d.title)
          if (self.props.onClick) self.props.onClick(d.title);
        }
      })
      .on("dblclick", function (d, i) {
        if (self.props.editable) {
          self.props.onAction({
            action: "edit-area",
            data: { ...d },
            index: i,
          });
        }
      })
      .call(this.dragArea);
  };

  updateMarky = () => {
    const marky = d3.select(this.marky);
    marky
      .selectAll("path")
      .data([this.markyData])
      .enter()
      .append("path")
      .attr("class", "marky")
      .attr("visibility", "hidden")
      .attr("stroke", "none")
      .attr("stroke-width", 2)
      .style("pointer-events", "none")
      .attr("fill", (d) => (d.color ? d.color : "none"))
      .attr("d", (d) => rect(d.x, d.y, d.x + d.width, d.y + d.height));
  };

  onFocus = (e) => {
    this.focused = true;
  };

  onBlur = () => {
    this.focused = false;
  };

  onKeyDown = (e) => {
    if (this.props.editable) {
      if (e.keyCode == 8 || e.keyCode == 46) {
        this.props.onAction({
          action: "delete-selection",
        });
      }
      if (e.keyCode == 32) {
        this.props.onAction({
          action: "show-data",
        });
      }
    }
  };

  onKeyPress = () => {};

  onKeyUp = (e) => {};

  onMouseMove = () => {};

  onMouseOut = () => {};

  onMouseOver = () => {};

  onMouseUp = () => {};

  onMouseEnter = () => {};

  onMouseLeave = () => {
    // if (this.shiftKey) {
    //   this.marky.width = 0;
    //   this.marky.height = 0;
    // }
  };

  render() {
    const style = {
      position: "relative",
      //backgroundColor: 'pink',
      margin: 0,
      padding: 0,
      width: "100%",
      height: "100%",
      //opacity: 0.5,
      ...this.props.style,
    };
    return (
      <div
        ref={(n) => (this.container = n)}
        style={style}
        onKeyDown={this.onKeyDown}
        onKeyPress={this.onKeyDown}
      >
        <svg
          ref={(n) => (this.svg = d3.select(n))}
          style={{
            width: "100%",
            height: "100%",
          }}
          // tabIndex={-100}
          // focusable="false"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onKeyPress={this.onKeyPress}
          onKeyUp={this.onKeyUp}
          onMouseMove={this.onMouseMove}
          onMouseOut={this.onMouseOut}
          onMouseOver={this.onMouseOver}
          onMouseUp={this.onMouseUp}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <g ref={(n) => (this.base = d3.select(n))} />
          <g ref={(n) => (this.marky = n)} />
        </svg>
      </div>
    );
  }
}

Area.defaultProps = {
  style: {},
  target: null,
  data: [],
  editable: true,
  onAction: (event) => {},
};
