import supabase from "./supabase-client.js"
import { useState, useEffect } from "react";

function Dashboard() {
    const [metrics, setMetrics] = useState([]);
    
    useEffect(() => {
        fetchMetrics()
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

    return (
        <div className="dashboard-wrapper">
        <div className="chart-container">
            <h2>Total Sales This Quarter ($)</h2>
        </div>
        </div>
    );
}

export default Dashboard;