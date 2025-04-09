import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';
import '../styles/styles.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeZoneClock from '../components/TimeZoneClock';
import { usePrevious } from '../hooks/usePrevious';
import CryptoIcon from '../components/CryptoIcon';

const CryptoData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'coin', direction: 'asc' });
    const [currentDatasetIndex, setCurrentDatasetIndex] = useState(0); // Track current dataset index
    const datasets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']; // List of datasets
    const prevData = usePrevious(data);
    const intervalRef = useRef(null);
    const dataVersion = useRef(0);
    const animatedValues = useRef({});
    const [showMoreLoading, setShowMoreLoading] = useState(false); // Loading state for "Show More"

    const fetchData = async (date, silent = false) => {
        if (!silent) setLoading(true);
        try {
            const isoDate = date.toISOString().split('T')[0];
            const response = await axios.get(
                `http://127.0.0.1:5000/api/crypto-dataA?date=${isoDate}&_=${Date.now()}`
            );
            setData(response.data.data);
            dataVersion.current += 1; // Increment version after successful fetch
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchNextDataset = async (date) => {
        setShowMoreLoading(true);
        const datasetKey = datasets[currentDatasetIndex + 1]; // Get the next dataset key
        if (datasetKey) {
            try {
                const isoDate = date.toISOString().split('T')[0];
                const response = await axios.get(
                    `http://127.0.0.1:5000/api/crypto-data${datasetKey}?date=${isoDate}&_=${Date.now()}`
                );
                setData(prev => [...prev, ...response.data.data]); // Append new data
                dataVersion.current += 1; // Increment version after successful fetch
                setCurrentDatasetIndex(prevIndex => prevIndex + 1); // Move to the next dataset index
            } catch (error) {
                console.error("Error fetching more data", error);
            }
        }
        setShowMoreLoading(false);
    };

    useEffect(() => {
        fetchData(selectedDate);
        if (selectedDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
            intervalRef.current = setInterval(() => {
                fetchData(selectedDate, true);
            }, 30000);
        }
        
        return () => clearInterval(intervalRef.current);  
    }, [selectedDate]);

    useEffect(() => {
        if (prevData && JSON.stringify(prevData) !== JSON.stringify(data)) {
            animatedValues.current = Object.fromEntries(
                data.map(item => [item.coin, Date.now()])
            );
        }
    }, [data, prevData]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDateChange = (date) => {
        if (!date) date = new Date();
        setSelectedDate(date);
        setData([]); // Clear existing data
        setCurrentDatasetIndex(0); // Reset dataset index
    };

    const handleShowMore = () => {
        clearInterval(intervalRef.current); // Stop live data fetching
        fetchNextDataset(selectedDate); // Fetch the next dataset
    };

    const filteredData = data
        .filter(item => item.coin.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            const multiplier = sortConfig.direction === 'asc' ? 1 : -1;

            if (sortConfig.key === 'coin') {
                return a.coin.localeCompare(b.coin) * multiplier;
            }
            if (sortConfig.key === 'fluctuation') {
                return (a.fluctuation - b.fluctuation) * multiplier;
            }
            if (sortConfig.key === 'rb') {
                // Sort RB: "🟢" should come before " "
                if (a.rb === "🟢" && b.rb !== "🟢") return -1 * multiplier;
                if (a.rb !== "🟢" && b.rb === "🟢") return 1 * multiplier;
                return 0; // Equal case
            }
            return 0;
        });

    const isCurrentDate = selectedDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];

    return (
        <div className="table-container">
            <div className="main-header">Locomotiv - Cryptocoin Data</div>
            <div className="header">
                <div className="controls-container">
                    <div className="date-picker-wrapper">
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            minDate={new Date('2020-01-01')}
                            maxDate={new Date()}
                            dateFormat="dd-MM-yyyy"
                            className="custom-date-picker"
                            popperPlacement="bottom-start"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            isClearable
                        />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search coins..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="search-input"
                    />
                </div>
                <div className="current-time" style={{ fontWeight: 'bold' }}>
                    <TimeZoneClock />
                </div>
            </div>

            <table className="crypto-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th onClick={() => handleSort('coin')}>
                            Coin {sortConfig.key === 'coin' && <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                        <th onClick={() => handleSort('rb')}>
                            RB {sortConfig.key === 'rb' && <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                        <th>Start Price</th>
                        <th>Highest Price</th>
                        {isCurrentDate ? null : <th>Lowest Price</th>}
                        {isCurrentDate ? null : <th>End Price</th>}
                        {isCurrentDate && <th>CP BB</th>}
                        <th onClick={() => handleSort('fluctuation')}>
                            Fluctuation {sortConfig.key === 'fluctuation' && <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
                        </th>
                    </tr>
                </thead>
                {!loading && filteredData.length > 0 && (
                    <tbody key={`data-version-${dataVersion.current}`}>
                        {filteredData.map((item, index) => {
                            const prevItem = prevData?.find(p => p.coin === item.coin);
                            const animationTrigger = animatedValues.current[item.coin] || 0;

                            return (
                                <tr key={`${item.coin}-${animationTrigger}`}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="coin-cell">
                                            <CryptoIcon symbol={item.coin} />
                                            <span className="coin-name">{item.coin}</span>
                                        </div>
                                    </td>
                                    <td>{item.rb}</td>
                                    <td>${item.start_price}</td>
                                    <td>${item.highest_price}</td>
                                    {isCurrentDate ? null : (
                                        <>
                                            <td className="value-container">
                                                <div className="animated-value">
                                                    {prevItem?.lowest_price !== item.lowest_price && (
                                                        <div className="old-value slide-down">
                                                            ${prevItem?.lowest_price}
                                                        </div>
                                                    )}
                                                    <div className="new-value">${item.lowest_price}</div>
                                                </div>
                                            </td>
                                            <td className="value-container">
                                                <div className="animated-value">
                                                    {prevItem?.end_price !== item.end_price && (
                                                        <div className="old-value slide-down">
                                                            ${prevItem?.end_price}
                                                        </div>
                                                    )}
                                                    <div className="new-value">${item.end_price}</div>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                    {isCurrentDate && (
                                        <td className="value-container">
                                            <div className="animated-value">
                                                {prevItem?.cp_bb !== item.cp_bb && (
                                                    <div className="old-value slide-down">
                                                        {/* ${prevItem?.cp_bb} */}
                                                    </div>
                                                )}
                                                <div className="new-value">${item.cp_bb}</div>
                                            </div>
                                        </td>
                                    )}
                                    <td className={`${item.fluctuation >= 0 ? 'fluctuation-positive' : 'fluctuation-negative'} value-container`}>
                                        <div className="animated-value">
                                            {prevItem?.fluctuation !== item.fluctuation && (
                                                <div className="old-value slide-down">
                                                    {/* {prevItem?.fluctuation?.toFixed(2)}% */}
                                                </div>
                                            )}
                                            <div className="new-value">{item.fluctuation.toFixed(2)}%</div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                )}
            </table>

            {loading && (
                <div className="spinner-container">
                    <BootstrapSpinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </BootstrapSpinner>
                </div>
            )}

            {!loading && (
                <div className="showButtonContainer">
                    <button className="show-more-button" onClick={handleShowMore} disabled={showMoreLoading}>
                        {showMoreLoading ? 'Loading...' : 'Show More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CryptoData;
