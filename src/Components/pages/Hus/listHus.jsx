
import { Outlet } from "react-router-dom";
import Header from "../../layout/Header";
import axios from "axios";
import React, { useEffect, useState, Fragment, useContext } from "react";
import { AuthContext } from '../../../AuthContext';
import { useNavigate } from 'react-router-dom';



const ListHus = () => {
    const navigate = useNavigate();
    const [bildeListe, setBildeListe] = useState([]);
    const [bilderUrl, setBilderUrl] = useState("");
    const [pris, setPris] = useState(0);
    const [beskrivelse, setBeskrivelse] = useState("");
    const [romAntall, setRomAntall] = useState(0);
    const [areal, setAreal] = useState(0);
    const [by, setBy] = useState("");
    const [adresse, setAdresse] = useState("");
    const [harParkering, setHarParkering] = useState(false);
    const [eierKontoNummer, setEierKontoNummer] = useState(0);
    const [erMoblert, setErMoblert] = useState(true);
    const { user } = useContext(AuthContext);


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('Pris', pris);
            formData.append('Beskrivelse', beskrivelse);
            formData.append('romAntall', romAntall);
            formData.append('areal', areal);
            formData.append('by', by);
            formData.append('Addresse', adresse);
            formData.append('harParkering', harParkering);
            formData.append('erMoblert', erMoblert);
            formData.append('eierKontoNummer', eierKontoNummer)
            bildeListe.forEach((file) => formData.append('bilder', file));
            formData.append('bilderUrl', bilderUrl);
            formData.append('ordreListe', JSON.stringify([]));

            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }


            const response = await axios.post(`http://localhost:11569/api/Hus/CreateHouseWithImages?email=${encodeURIComponent(user.email)}`, formData, {});
            if (response.status === 200 && response.data.houseId) {

                const houseId = response.data.houseId;
                navigate(`/oversikt/${houseId}`)



            }
            console.log(response.data);
        } catch (error) {
            console.error('There was an error posting the data', error);
        }



    };

    const handleImageUpload = (event) => {
        console.log("File Input Changed")
        const files = Array.from(event.target.files);
        console.log("Selected files,", files)

        const newImageUrls = files.map(file => URL.createObjectURL(file));


        if (newImageUrls.length > 0) {
            setBilderUrl(newImageUrls[0]);
        }


        setBildeListe(prevBildeListe => [...prevBildeListe, ...files]);
    };

    return (
        <Fragment>
            <section>
                <div className="full-height-container bg-dark">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <h1 className="text-center display-4 py-2 mb-4 bg-dark text-white">List a new House</h1>
                            <form onSubmit={handleSubmit}>
                                <label className="form-check-label text-white" htmlFor="pris" >
                                    Price
                                    <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={pris}
                                    onChange={(e) => setPris(e.target.value)}
                                    min="1"
                                    max="10000"
                                    step="0.01"
                                    required
                                />
                                <label className="form-check-label text-white" htmlFor="romAntall">
                                    Number of Rooms
                                    <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={romAntall}
                                    onChange={(e) => {
                                        const newValue = Math.max(0, Math.min(10000, parseFloat(e.target.value)));
                                        setRomAntall(newValue);
                                    }}
                                    min="0"
                                    max="20"
                                    step="0.01"
                                    required
                                />
                                <label className="form-check-label text-white" htmlFor="Adress">
                                    Address
                                <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={adresse}
                                    onChange={(e) => setAdresse(e.target.value.trim())}
                                    required
                                    minLength="10"
                                    maxLength="100"
                                />

                                <label className="form-check-label text-white" htmlFor="by">
                                    City
                                <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={by}
                                    onChange={(e) => setBy(e.target.value)}
                                    required
                                />

                                <label className="form-check-label text-white" htmlFor="moblert">
                                    Furnished ?
                                </label>
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="erMoblert"
                                        checked={erMoblert}
                                        onChange={(e) => setErMoblert(e.target.checked)}
                                    />
                                </div>
                                <label className="form-check-label text-white" htmlFor="harParkering">
                                    Parking Available ?
                                </label>
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="harParkering"
                                        checked={harParkering}
                                        onChange={(e) => setHarParkering(e.target.checked)}
                                    />
                                </div>
                                <label className="form-check-label text-white" htmlFor="eierKontoNummer">
                                    Owner Account Number
                                <span className="text-danger">*</span></label>
                                <div className="mb-3">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={eierKontoNummer}
                                        onChange={(e) => setEierKontoNummer(e.target.value)}
                                        pattern="^\d{11}$"
                                        title="Enter an 11-digit number"
                                        required
                                    />
                                </div>

                                <label className="form-check-label text-white" htmlFor="harParkering">
                                    Size in m<sup>2</sup>
                                <span className="text-danger">*</span></label>
                                <div className="mb-3">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={areal}
                                        onChange={(e) => {
                                            // Allow only numbers and decimal points
                                            const validValue = e.target.value.replace(/[^0-9.]/g, '');
                                            // Update the state only if the new value is a valid number or empty
                                            if (validValue === '' || !isNaN(validValue)) {
                                                setAreal(validValue);
                                            }
                                        }}
                                        required
                                    />
                                </div>

                                <label className="form-check-label text-white" htmlFor="beskrivelse">
                                    Description
                                </label>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        value={beskrivelse}
                                        onChange={(e) => setBeskrivelse(e.target.value)}
                                        rows="5"
                                    />
                                </div>
                                <label className="form-check-label text-white" htmlFor="harParkering">
                                    Upload Images
                                </label>
                                <div className="mb-3">
                                    <input type="file" className="form-control" onChange={handleImageUpload} multiple />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">List House</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default ListHus;