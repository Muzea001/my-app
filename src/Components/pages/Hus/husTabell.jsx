import React, { useEffect, useState, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from "react-bootstrap/Table";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HusTabell = (props) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedHusId, setSelectedHusId] = useState(null);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [roomFilter, setRoomFilter] = useState('');
    const [parkingFilter, setParkingFilter] = useState(false);
    const [furnishedFilter, setFurnishedFilter] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = data.filter(item => {
            return (priceFilter ? item.pris <= priceFilter : true) &&
                (cityFilter ? item.by.toLowerCase().includes(cityFilter.toLowerCase()) : true) &&
                (roomFilter ? item.romAntall === parseInt(roomFilter, 10) : true) &&
                (!parkingFilter || item.harParkering === parkingFilter) &&
                (!furnishedFilter || item.erMoblert === furnishedFilter);
        });
        setFilteredData(filtered);
    }, [data, priceFilter, cityFilter, roomFilter, parkingFilter, furnishedFilter]);

    async function fetchData() {
        try {
            const result = await axios.get("http://localhost:11569/api/Hus/Tabell");
            setData(result.data);
            setFilteredData(result.data); // Initialize filteredData with all data
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const detailClick = (husId) => {
        navigate(`/oversikt/${husId}`);
    }

    const handleEditClick = (husId) => {
        navigate('/endreHus', { state: { husId } });
    };

    const handleDeleteClick = (husId) => {
        setSelectedHusId(husId);
        setDeleteErrorMessage('');
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:11569/api/Hus/SlettBekreftet?id=${selectedHusId}`);
            setShowModal(false);
            fetchData(); // Refresh the data
        } catch (error) {
            console.error('Error deleting house: ', error);
            if (error.response && error.response.status === 400) {
                setDeleteErrorMessage(error.response.data || 'An unexpected error occurred');
            } else {
                setDeleteErrorMessage('A network error occurred');
            }
            setShowModal(true); // Keep the modal open to show the error
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDeleteErrorMessage('');
    };

    return (
        <div className="full-height-container bg-dark">
            {props.type === "Tabell" ?
                <Fragment>
                    <section>
                        <h1 className="text-center display-4 py-2 mb-4 bg-dark text-white">House Rental</h1>
                        <Table striped hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Price</th>
                                    <th>Description</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.pris}</td>
                                            <td>{item.beskrivelse}</td>
                                            <td>
                                                {item.bildeListe && item.bildeListe.length > 0 && (
                                                    <img
                                                        src={`http://localhost:11569${item.bildeListe[0].bilderUrl}`}
                                                        alt="House"
                                                        style={{ maxWidth: '80px', maxHeight: '80px' }}
                                                    />
                                                )}
                                            </td>
                                            <td>
                                                <button className="btn btn-primary" onClick={() => handleEditClick(item.husId)}>Edit</button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDeleteClick(item.husId)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No data found...</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </section>
                </Fragment>
                :
                <Fragment>
                    <section>
                        <h1 className="text-center display-4 py-2 mb-4 bg-dark text-white">Welcome</h1>
                        <div className="mb-3 text-center">
                            <div className="row justify-content-center">

                                <div className="col-2">
                                    <label className="text-white mb-1">Price</label>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white"
                                        placeholder="Filter by price..."
                                        value={priceFilter}
                                        onChange={e => {
                                            const value = e.target.value;
                                            // Basic validation: Allow only numbers and decimal points
                                            if (/^\d*\.?\d*$/.test(value)) {
                                                setPriceFilter(value);
                                            }
                                        }}
                                    />

                                </div>


                                <div className="col-2">
                                    <label className="text-white mb-1">City</label>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white"
                                        placeholder="Filter by city..."
                                        value={cityFilter}
                                        onChange={e => {
                                            const value = e.target.value;
                                            // Basic validation: Allow alphabetic characters, spaces, hyphens, and apostrophes
                                            if (/^[a-zA-Z\s-']*$/i.test(value) && value.length <= 50) {
                                                setCityFilter(value);
                                            }
                                        }}
                                    />

                                </div>


                                <div className="col-2">
                                    <label className="text-white mb-1">Rooms</label>
                                    <input
                                        type="number"
                                        className="form-control bg-dark text-white"
                                        placeholder="Filter by rooms..."
                                        value={roomFilter}
                                        onChange={e => {
                                            const value = e.target.value;

                                            // Allow the field to be empty to enable editing
                                            if (value === '') {
                                                setRoomFilter(value);
                                            } else {
                                                // Convert the input value to an integer
                                                const intValue = parseInt(value, 10); // Base 10 for decimal numbers

                                                // Basic validation: Check if the value is a number and within the specified range (1-20)
                                                if (!isNaN(intValue) && intValue > 0 && intValue <= 20) {
                                                    setRoomFilter(intValue);
                                                }
                                            }
                                        }}
                                    />



                                </div>
                            </div>


                            <div className="row justify-content-center mt-2">
                                {/* Parking Filter */}
                                <div className="col-auto">
                                    <label className="text-white px-2">Parking?</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input ml-2"
                                        id="parkingFilter"
                                        checked={parkingFilter}
                                        onChange={e => setParkingFilter(e.target.checked)}
                                    />
                                </div>


                                <div className="col-auto">
                                    <label className="text-white px-2">Furnished?</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input ml-2"
                                        id="furnishedFilter"
                                        checked={furnishedFilter}
                                        onChange={e => setFurnishedFilter(e.target.checked)}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="container">
                            <div className="row">
                                {data && data.length > 0 ? (
                                    (priceFilter || cityFilter || roomFilter || parkingFilter || furnishedFilter) ?
                                        filteredData.map((item, index) => (
                                            <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                                                <div className="card h-100 border-primary">
                                                    {item.bildeListe && item.bildeListe.length > 0 && (
                                                        <img
                                                            src={`http://localhost:11569${item.bildeListe[0].bilderUrl}`}
                                                            className="card-img-top"
                                                            alt="House"
                                                        />
                                                    )}
                                                    <div className="card-body d-flex flex-column">
                                                        <h5 className="card-title">Price: {item.pris}</h5>
                                                        <p className="card-text">{item.beskrivelse}</p>
                                                        <button className="btn btn-primary mt-auto" onClick={() => detailClick(item.husId)}>Details</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )) :
                                        data.map((item, index) => (
                                            <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                                                <div className="card h-100 border-primary">
                                                    {item.bildeListe && item.bildeListe.length > 0 && (
                                                        <img
                                                            src={`http://localhost:11569${item.bildeListe[0].bilderUrl}`}
                                                            className="card-img-top"
                                                            alt="House"
                                                        />
                                                    )}
                                                    <div className="card-body d-flex flex-column">
                                                        <h5 className="card-title">Price: {item.pris}</h5>
                                                        <p className="card-text">{item.beskrivelse}</p>
                                                        <button className="btn btn-primary mt-auto" onClick={() => detailClick(item.husId)}>Details</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="col-12">
                                        <p className="text-center">No data found...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </Fragment>
            }

            {/* Modal for delete confirmation */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteErrorMessage ?
                        <div className="alert alert-danger">{deleteErrorMessage}</div> :
                        `Are you sure you want to delete the house with the ID ${selectedHusId}?`}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    {deleteErrorMessage ?
                        <Button variant="primary" onClick={() => setDeleteErrorMessage('')}>Close</Button> :
                        <Button variant="danger" onClick={handleConfirmDelete}>Confirm</Button>}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HusTabell;
