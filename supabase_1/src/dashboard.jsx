import supabase from "./supabase-client.js"
import { useState, useEffect } from "react";
import {Chart} from 'react-charts';
import Form from './form'

function Dashboard() {
    const [metrics, setMetrics] = useState([]);
    
    useEffect(() => {
        fetchMetrics()

        const channel = supabase.channel('deal-changes')
        .on('postgres_changes',
            {
                event : '*',
                schema : 'public',
                table : 'sales_deals'
            }, (payload) => {
                fetchMetrics()
            }).subscribe();
        
        return () => {
            supabase.removeChannel(channel);
        }
    }, []);

    async function fetchLargest() {
        const response = await supabase.from('sales_deals').select('name,value')
        .order('value', { ascending: false }).limit(1)
        console.log(response);
    }

    async function fetchMetrics() {
        try {
            const {data, error} = await supabase.from('sales_deals').select('name,value.sum()');
            if (error) {
                throw error;
            }
            console.log(data);
            setMetrics(data);
        }
        catch (error) {
            console.log('Error fetching metrics: ', error)
        }
    }

    const chartData = [
        {
        data: metrics.map((m) => ({
            primary: m.name,
            secondary: m.sum,
        })),
        },
    ];

    const primaryAxis = {
        getValue: (d) => d.primary,
        scaleType: 'band',
        padding: 0.2,
        position: 'bottom',
    };

    const secondaryAxes = [
        {
        getValue: (d) => d.secondary,
        scaleType: 'linear',
        min: 0,
        max: y_max(),
        padding: {
            top: 20,
            bottom: 40,
        },
        },
    ];

    function y_max() {
        if (metrics.length > 0) {
        const maxSum = Math.max(...metrics.map((m) => m.sum));
        return maxSum + 2000;
        }
        return 5000; 
    }

    return (
        <div className="dashboard-wrapper">
        <div className="chart-container">
            <h2>Total Sales This Quarter ($)</h2>
            <div style={{ flex: 1 }}>
            <Chart
                options={{
                data: chartData,
                primaryAxis,
                secondaryAxes,
                type: 'bar',
                defaultColors: ['#58d675'],
                tooltip: {
                    show: false,
                },
                }}
            />
            </div>
        </div>
        <Form metrics={metrics} />
        </div>
    );
}

export default Dashboard;