import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';

import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import warningIcon from '../../assets/images/icons/warning.svg';

import api from '../../services/api';

import './styles.css';

const TeacherForm: React.FC = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');

  const [subject, setSubject] = useState('');
  const [cost, setCost] = useState('');

  const [scheduleItems, setScheduleItems] = useState([
    { week_day: 0, from: '', to: ''}
  ]);

  const history = useHistory();

  function addNewScheduleItem() {
    // Adicionando um novo objeto dentro do Array
    setScheduleItems([
      ...scheduleItems,
      {
        week_day: 0, from: '', to: ''
      }
    ]);
  }

  function setScheduleItemValue(position: number, field: string, value: string) {
    const updatedScheduleItem = scheduleItems.map((scheduleItem, index) => {
      if(index === position) {
        return {
          ...scheduleItem,
          [field]: value
        };
      }

      return scheduleItem;
    });

    setScheduleItems(updatedScheduleItem);
  }

  function handleCreateClass(e: FormEvent) {
    // Previne o reaload após o submit do formulário
    e.preventDefault();
    api.post('classes', {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost: Number(cost),
      schedule: scheduleItems,
    }).then(() => {
      alert('Cadastro realizado com sucesso!');

      history.push('/');
    }).catch(() => {
      alert('Erro no cadastro');
    })
  }

  return (
    <div id="page-teacher-form" className="container">
      <PageHeader 
        title="Que incrível que você queira dar aulas!"
        description="O primeiro passo é preencher esse formulário de inscrição"
      />
      
      <main>
        <form onSubmit={handleCreateClass}>
          <fieldset>
            <legend>Seus dados</legend>
            <Input 
              label="Nome completo"
              name="name" value={name}
              onChange={(e) => { setName(e.target.value) }}
            />
            <Input 
              label="Avatar"
              name="avatar"
              value={avatar}
              onChange={(e) => { setAvatar(e.target.value) }}
            />
            <Input 
              label="Whatsapp"
              name="whatsapp"
              value={whatsapp}
              onChange={(e) => { setWhatsapp(e.target.value) }}
            />
            <Textarea
              label="Biografia"
              name="bio"
              value={bio}
              onChange={(e) => { setBio(e.target.value) }}
            />
          </fieldset>

          <fieldset>
            <legend>Sobre a aula</legend>
            <Select
              label="Matéria" 
              name="subject"
              value={subject}
              onChange={(e) => { setSubject(e.target.value) }}
              options={[
                { value: 'Artes', label: 'Artes'},
                { value: 'Biologia', label: 'Biologia'},
                { value: 'Matemática', label: 'Matemática'},
                { value: 'Português', label: 'Português'},
                { value: 'Filosofia', label: 'Filosofia'},
                { value: 'Geografia', label: 'Geografia'},
                { value: 'Química', label: 'Química'},
                { value: 'Física', label: 'Física'},
              ]}
            />
            <Input
              label="Custo da sua aula por hora"
              name="cost"
              value={cost}
              onChange={(e) => { setCost(e.target.value) }}
            />
          </fieldset>

          <fieldset>
            <legend>Horários disponíveis
            <button type="button" onClick={addNewScheduleItem}>
               + Novo horário
            </button>
            </legend>

           {scheduleItems.map((scheduleItem, index) => {
             return (
              <div className="schedule-item" key={scheduleItem.week_day}>
              <Select
                label="Dia da semana" 
                name="week_day"
                value={scheduleItem.week_day}
                onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
                options={[
                  { value: '0', label: 'Domingo'},
                  { value: '1', label: 'Segunda-feira'},
                  { value: '2', label: 'Terça-feira'},
                  { value: '3', label: 'Quarta-feira'},
                  { value: '4', label: 'Quinta-feira'},
                  { value: '5', label: 'Sexta-feira'},
                  { value: '6', label: 'Sábado'},
                ]}
              />
              <Input
                name="from"
                label="Das"
                type="time"
                onChange={e => setScheduleItemValue(index, 'from', e.target.value)} 
              />
              <Input 
                name="to"
                label="Até"
                type="time"
                onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
              />
              </div>
             )
           })} 
          </fieldset>

          <footer>
            <p>
              <img src={warningIcon} alt="Aviso importante"/>
              Importante! <br />
              Preencha todos os dados!
            </p>
            <button type="submit">Salvar cadastro</button>
          </footer>
        </form>
      </main>
    </div>
  );
}

export default TeacherForm;