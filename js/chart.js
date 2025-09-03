const AutismWheelChart = {
    canvas: null,
    ctx: null,
    saveBtn: null,
    currentMetrics: [],
    selections: {},
    activeSlice: null,
    hoveredSegment: null,

    chartConfig: {
        centerX: 300,
        centerY: 300,
        radius: 240, // 600 / 2 - 60
        levels: 10,
        labelFont: "12px Arial",
        dataFont: "10px Arial",
        lineColor: "#ccc",
        labelColor: "#333",
    },

    sliceColors: [
        'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
        'rgba(199, 199, 199, 0.6)', 'rgba(83, 102, 255, 0.6)',
        'rgba(4, 216, 216, 0.6)'
    ],

    init(metrics) {
        this.canvas = document.getElementById('autismWheel');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.saveBtn = document.getElementById('saveBtn');

        this.currentMetrics = metrics;
        this.selections = Object.fromEntries(this.currentMetrics.map((_, i) => [i, []]));

        this.drawChart();

        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        this.saveBtn.addEventListener('click', this.handleSaveImage.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
    },

    drawChart() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const numMetrics = this.currentMetrics.length;
        if (numMetrics === 0) return;

        const angleSlice = (Math.PI * 2) / numMetrics;

        // Draw selection areas
        this.ctx.lineStyle = "none";
        for (let i = 0; i < numMetrics; i++) {
            const sliceSelections = this.selections[i] || [];
            if (sliceSelections.length === 0) continue;

            const anglePadding = 0.015;
            const startAngle = (i * angleSlice - Math.PI / 2) + anglePadding;
            const endAngle = ((i + 1) * angleSlice - Math.PI / 2) - anglePadding;

            if (i === this.activeSlice && sliceSelections.length === 1) {
                const firstLevel = sliceSelections[0];
                const hoverLevel = (this.hoveredSegment && this.hoveredSegment.slice === i) ? this.hoveredSegment.level : firstLevel;
                const range = [firstLevel, hoverLevel].sort((a,b) => a - b);
                const minRadius = (this.chartConfig.radius / this.chartConfig.levels) * (range[0] - 1);
                const maxRadius = (this.chartConfig.radius / this.chartConfig.levels) * range[1];
                this.drawSegment(startAngle, endAngle, minRadius, maxRadius, "rgba(255, 215, 0, 0.6)");
            } else if (sliceSelections.length === 2) {
                const minRadius = (this.chartConfig.radius / this.chartConfig.levels) * (sliceSelections[0] - 1);
                const maxRadius = (this.chartConfig.radius / this.chartConfig.levels) * sliceSelections[1];
                this.drawSegment(startAngle, endAngle, minRadius, maxRadius, this.sliceColors[i % this.sliceColors.length]);
            }
        }

        // Draw hover highlight
        if (this.hoveredSegment) {
            const { slice, level } = this.hoveredSegment;
            const anglePadding = 0.015;
            const startAngle = (slice * angleSlice - Math.PI / 2) + anglePadding;
            const endAngle = ((slice + 1) * angleSlice - Math.PI / 2) - anglePadding;
            const minRadius = (this.chartConfig.radius / this.chartConfig.levels) * (level - 1);
            const maxRadius = (this.chartConfig.radius / this.chartConfig.levels) * level;

            this.ctx.beginPath();
            this.ctx.arc(this.chartConfig.centerX, this.chartConfig.centerY, maxRadius, startAngle, endAngle, false);
            this.ctx.arc(this.chartConfig.centerX, this.chartConfig.centerY, minRadius, endAngle, startAngle, true);
            this.ctx.closePath();
            this.ctx.strokeStyle = "#000000";
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.lineWidth = 1;
        }

        // Draw web
        this.ctx.strokeStyle = this.chartConfig.lineColor;
        for (let i = 1; i <= this.chartConfig.levels; i++) {
            const levelRadius = (this.chartConfig.radius / this.chartConfig.levels) * i;
            this.ctx.beginPath();
            this.ctx.arc(this.chartConfig.centerX, this.chartConfig.centerY, levelRadius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        // Draw spokes
        for (let i = 0; i < numMetrics; i++) {
            const angle = i * angleSlice - Math.PI / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.chartConfig.centerX, this.chartConfig.centerY);
            this.ctx.lineTo(this.chartConfig.centerX + this.chartConfig.radius * Math.cos(angle), this.chartConfig.centerY + this.chartConfig.radius * Math.sin(angle));
            this.ctx.stroke();
        }

        this.drawLabels();
        this.drawLevelNumbers();
    },

    drawSegment(startAngle, endAngle, minRadius, maxRadius, color) {
        this.ctx.beginPath();
        this.ctx.arc(this.chartConfig.centerX, this.chartConfig.centerY, maxRadius, startAngle, endAngle, false);
        this.ctx.arc(this.chartConfig.centerX, this.chartConfig.centerY, minRadius, endAngle, startAngle, true);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    },

    drawLabels() {
        const numMetrics = this.currentMetrics.length;
        const angleSlice = (Math.PI * 2) / numMetrics;
        this.ctx.font = this.chartConfig.labelFont;
        this.ctx.fillStyle = this.chartConfig.labelColor;
        const labelRadius = this.chartConfig.radius + 20;

        for (let i = 0; i < numMetrics; i++) {
            const angle = (i * angleSlice) + (angleSlice / 2) - (Math.PI / 2);
            const x = this.chartConfig.centerX + labelRadius * Math.cos(angle);
            const y = this.chartConfig.centerY + labelRadius * Math.sin(angle);

            this.ctx.save();
            this.ctx.translate(x, y);
            let rotation = angle + Math.PI / 2;
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = (angle > 0 && angle < Math.PI) ? "top" : "bottom";
            if (angle > Math.PI / 2 || angle < -Math.PI / 2) rotation += Math.PI;
            this.ctx.rotate(rotation);

            const lineHeight = 14;
            const words = this.currentMetrics[i].split(' ');
            const lines = [];
            let currentLine = '';

            for (const word of words) {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const metrics = this.ctx.measureText(testLine);
                if (metrics.width > (this.chartConfig.radius * angleSlice) * 0.8 && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);

            let start_y = (this.ctx.textBaseline === 'bottom') ? -(lines.length - 1) * lineHeight : 0;
            for (let j = 0; j < lines.length; j++) {
                this.ctx.fillText(lines[j], 0, start_y + (j * lineHeight));
            }
            this.ctx.restore();
        }
    },

    drawLevelNumbers() {
        this.ctx.font = this.chartConfig.dataFont;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        for (let i = 1; i <= this.chartConfig.levels; i++) {
            const levelRadius = (this.chartConfig.radius / this.chartConfig.levels) * i;
            const angle = -Math.PI / 2;
            const x = this.chartConfig.centerX + levelRadius * Math.cos(angle);
            const y = this.chartConfig.centerY + levelRadius * Math.sin(angle);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.beginPath();
            this.ctx.arc(x, y - 1, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.fillStyle = this.chartConfig.labelColor;
            this.ctx.fillText(i, x, y);
        }
    },

    handleCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const segment = this.getSegmentFromCoordinates(event.clientX - rect.left, event.clientY - rect.top);
        if (!segment) return;

        const { slice: metricIndex, level } = segment;
        if (this.activeSlice === null) {
            this.selections[metricIndex] = [level];
            this.activeSlice = metricIndex;
        } else if (this.activeSlice === metricIndex) {
            this.selections[metricIndex].push(level);
            this.selections[metricIndex].sort((a, b) => a - b);
            this.activeSlice = null;
        }
        this.drawChart();
    },

    handleSaveImage() {
        const originalCanvasState = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const dataURL = this.canvas.toDataURL('image/png');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.putImageData(originalCanvasState, 0, 0);
        this.ctx.globalCompositeOperation = 'source-over';
        const link = document.createElement('a');
        link.download = 'autism-wheel.png';
        link.href = dataURL;
        link.click();
    },

    getSegmentFromCoordinates(x, y) {
        const dx = x - this.chartConfig.centerX;
        const dy = y - this.chartConfig.centerY;
        const angle = Math.atan2(dy, dx);
        const radius = Math.sqrt(dx * dx + dy * dy);

        if (radius > this.chartConfig.radius) return null;

        const numMetrics = this.currentMetrics.length;
        if (numMetrics === 0) return null;

        const angleSlice = (Math.PI * 2) / numMetrics;
        const normalizedAngle = (angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
        const slice = Math.floor(normalizedAngle / angleSlice);
        const level = Math.floor((radius / this.chartConfig.radius) * this.chartConfig.levels) + 1;

        if (level > this.chartConfig.levels) return null;
        return { slice, level };
    },

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const segment = this.getSegmentFromCoordinates(event.clientX - rect.left, event.clientY - rect.top);
        if (segment) {
            if (!this.hoveredSegment || this.hoveredSegment.slice !== segment.slice || this.hoveredSegment.level !== segment.level) {
                this.hoveredSegment = segment;
                this.drawChart();
            }
        } else if (this.hoveredSegment !== null) {
            this.hoveredSegment = null;
            this.drawChart();
        }
    },

    handleMouseOut() {
        if (this.hoveredSegment !== null) {
            this.hoveredSegment = null;
            this.drawChart();
        }
    }
};
