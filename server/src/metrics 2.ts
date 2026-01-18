export const metrics = {
    requestsPerMinute: 0
};

// Reset every minute
setInterval(() => {
    metrics.requestsPerMinute = 0;
}, 60000);
