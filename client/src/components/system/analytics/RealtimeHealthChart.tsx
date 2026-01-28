'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Activity, Cpu, Server } from 'lucide-react';
import { DynamicIcon } from '@/components/DynamicIcon';
import { api } from '@/lib/api';

interface HealthData {
    time: string;
    memory: number; // MB
    cpu: number; // Load Avg (1m)
    timestamp: number;
}

interface SystemStats {
    uptime: number;
    memory: {
        rss: number;
        heapTotal: number;
        heapUsed: number;
        external: number;
    };
    os: {
        loadAvg: number[];
    };
    nodeVersion: string;
    serverTime: string;
}

export function RealtimeHealthChart() {
    const [data, setData] = useState<HealthData[]>([]);
    const [currentStats, setCurrentStats] = useState<SystemStats & { rpm: number } | null>(null);

    // Thresholds
    const MEMORY_WARNING_THRESHOLD = 512; // MB
    const LOAD_WARNING_THRESHOLD = 1.5;
    const RPM_COST_WARNING_THRESHOLD = 600; // > 10 requests/sec implies scale up

    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        // Initial load
        const fetchData = async () => {
            try {
                const stats: any = await api.system.getStats();

                const now = new Date();
                const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

                const memoryMB = Math.round(stats.memory.rss / 1024 / 1024);
                // stats.os.loadAvg returns [1m, 5m, 15m]
                const cpuLoad = stats.os.loadAvg ? stats.os.loadAvg[0] : 0;
                // mock RPM locally since middleware just started, or use real
                const rpm = stats.rpm || 0;

                setCurrentStats({ ...stats, rpm });

                // Deduplicate by time string to avoid StrictMode double-fetch issues
                setData(prev => {
                    const lastPoint = prev[prev.length - 1];
                    if (lastPoint && lastPoint.time === timeStr) return prev;

                    const newData = [...prev, {
                        time: timeStr,
                        memory: memoryMB,
                        cpu: cpuLoad,
                        timestamp: now.getTime()
                    }];
                    // Keep last 20 points
                    if (newData.length > 20) return newData.slice(newData.length - 20);
                    return newData;
                });
                setPermissionDenied(false);
            } catch (error: any) {
                if (error.status === 403) {
                    setPermissionDenied(true);
                } else {
                    console.error("Failed to fetch health stats", error);
                }
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const getStatus = (memory: number, load: number) => {
        if (memory > MEMORY_WARNING_THRESHOLD || load > LOAD_WARNING_THRESHOLD) return { label: 'CẢNH BÁO', icon: 'AlertTriangle', color: 'text-zinc-900', bg: 'bg-white border border-zinc-200' };
        return { label: 'TỐT', icon: 'ShieldCheck', color: 'text-white', bg: 'bg-zinc-900 border border-zinc-900' };
    };

    const getCostStatus = (rpm: number) => {
        if (rpm > RPM_COST_WARNING_THRESHOLD) return { label: 'CAO', icon: 'Zap', color: 'text-white', bg: 'bg-zinc-900 border border-zinc-900' };
        return { label: 'TỐI ƯU', icon: 'ShieldCheck', color: 'text-zinc-900', bg: 'bg-white border border-zinc-200' };
    };

    if (permissionDenied) return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <Activity size={18} /> System Health
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] flex flex-col items-center justify-center text-center p-6">
                <div className="rounded-full bg-muted p-3 mb-3">
                    <Activity size={24} className="text-muted-foreground opacity-50" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Quyền truy cập bị hạn chế</h3>
                <p className="text-xs text-muted-foreground">Bạn không có quyền xem thông số hệ thống Realtime.</p>
            </CardContent>
        </Card>
    );

    if (!currentStats) return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <Activity size={18} /> System Health
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Loading system stats...</p>
            </CardContent>
        </Card>
    );

    const currentMemory = Math.round(currentStats.memory.rss / 1024 / 1024);
    const currentLoad = currentStats.os.loadAvg ? currentStats.os.loadAvg[0] : 0;
    const currentRpm = currentStats.rpm;

    const status = getStatus(currentMemory, currentLoad);
    const costStatus = getCostStatus(currentRpm);

    return (
        <Card className="h-full border-black/10 shadow-sm">
            <CardHeader className="pb-2 border-b border-dashed">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Activity size={18} /> System Health
                    </CardTitle>
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mr-1">
                            Chi phí:
                            <div className={`px-2 py-0.5 rounded-full border flex items-center gap-1.5 font-bold ${costStatus.bg} ${costStatus.color}`}>
                                <DynamicIcon name={costStatus.icon || 'Activity'} className="w-3 h-3" />
                                {costStatus.label}
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            Hệ thống:
                            <div className={`px-2 py-0.5 rounded-full border flex items-center gap-1.5 font-bold ${status.bg} ${status.color}`}>
                                <DynamicIcon name={status.icon || 'Activity'} className="w-3 h-3" />
                                {status.label}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 text-xs mt-2">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Memory</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-semibold text-foreground">{currentMemory}</span>
                            <span className="text-muted-foreground">MB</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Safe: &lt;{MEMORY_WARNING_THRESHOLD}MB</span>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Load</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-semibold text-foreground">{currentLoad.toFixed(2)}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Safe: &lt;{LOAD_WARNING_THRESHOLD}</span>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Traffic (RPM)</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-semibold text-foreground">{currentRpm}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Warn: &gt;{RPM_COST_WARNING_THRESHOLD}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 10, fill: '#666' }}
                                axisLine={false}
                                minTickGap={60}
                                tickMargin={2}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#666' }}
                                tickLine={false}
                                axisLine={false}
                                width={35}
                                domain={[0, (dataMax: number) => Math.max(dataMax * 1.2, MEMORY_WARNING_THRESHOLD)]}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                labelStyle={{ color: '#666', fontSize: '12px' }}
                                itemStyle={{ fontSize: '12px', color: '#000' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="memory"
                                stroke="#18181b"
                                strokeWidth={1.5}
                                fillOpacity={1}
                                fill="url(#colorMemory)"
                                name="Memory (MB)"
                                animationDuration={500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <div>
                            <div className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                                <Activity size={14} /> Memory Usage
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">RAM đang sử dụng.</p>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                                <span className="text-zinc-500 font-medium">Ổn định</span>
                                <span className="font-mono font-bold text-zinc-900">&lt;512MB</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-zinc-500 font-medium">Cảnh báo</span>
                                <span className="font-mono font-bold text-zinc-900">&gt;512MB</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <div className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                                <Cpu size={14} /> CPU Load
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Tải trung bình (1m).</p>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                                <span className="text-zinc-500 font-medium">Ổn định</span>
                                <span className="font-mono font-bold text-zinc-900">&lt;1.5</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-zinc-500 font-medium">Quá tải</span>
                                <span className="font-mono font-bold text-zinc-900">&gt;1.5</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <div className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                                <Server size={14} /> Traffic (RPM)
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Số request/phút.</p>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center py-1 border-b border-zinc-50">
                                <span className="text-zinc-500 font-medium">Tiết kiệm</span>
                                <span className="font-mono font-bold text-zinc-900">&lt;600</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-zinc-500 font-medium">Scale Up</span>
                                <span className="font-mono font-bold text-zinc-900">&gt;600</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
