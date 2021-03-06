import React, {useEffect, useState} from "react";
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi'
import logoImg from '../../assets/logo.svg';
import './styles.css'
import api from "../../services/api";
export default function Profile(){
    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');
    const history = useHistory();
    const [incidents, setIncidents] = useState([]);
    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId
            }
        }).then((res) => {
            setIncidents(res.data);
        })
    }, []);
    function handleLogout(){
        localStorage.clear();
        history.push('/');
    }
    async function handleDeleteIncident(id){
        try{
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId
                }
            });
            setIncidents(prevState => prevState.filter(item => item.id !== id));
        }catch (e) {
            alert('Erro ao deletar caso, tente novamente');
        }
    }
    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be the hero"/>
                <span>Bem vinda, {ongName}</span>
                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041"/>
                </button>
            </header>
            <h1>Casos Cadastrados</h1>
            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO: </strong>
                        <p>{incident.title}</p>
                        <strong>DESCRIÇÃO: </strong>
                        <p>{incident.description} </p>
                        <strong>VALOR: </strong>
                        <p> {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                            .format(incident.value)}</p>
                        <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                            <FiTrash2 size={20} color="#A8A8B3"/>
                        </button>
                    </li>

                ))}
            </ul>
        </div>
    );

}
