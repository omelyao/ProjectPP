import React from 'react';
import classes from './css/AssesmentPage.module.css'
import Criterion from './components/Criterion';
import { useParams } from 'react-router-dom';
import { useGetStagesQuery, useGetTeamEstimationsQuery, useGetTeamQuery } from '../../redux/authApi';


function AssessmentPage() {
    const {teamId} = useParams();
    const stages = useGetStagesQuery({id: teamId});
    const team = useGetTeamQuery({id:teamId});





    return (
        <div className={classes["forms"]}>
            <h2>Оценка по этапам</h2>
            <p className={classes["info"] + " " + classes["command"]}>Проект: <span>нет данных</span></p>
            <p className={classes["info"] + " " + classes["command"]}>Команда: <span>нет данных</span></p>
            <p className={classes["info"] + " " + classes["command"]}>Окончание оценки этапа: <span>нет данных</span></p>
            <form className={classes['mark-form']} action="" method="post">
                <label >
                    <span className={classes["choosing"]}>Выберите этап:</span>
                    <select className={classes["form-selector"]} name="form-selector">
                        <option value="1">1.Анализ, подготовка ТЗ</option>
                        <option value="2">2.Обсуждение</option>
                        <option value="3">3.Тестирование формы оценки</option>
                    </select>
                </label>
                <br/>
                <label >
                    <span className={classes["choosing"]}>Выберите стажёра:</span>
                    <select className={classes["form-selector"]} name="form-selector">
                        <option value="1">Ваганова Ангелина Владимировна</option>
                        <option value="2">Деньшик Дарья Дмитриевна</option>
                        <option value="3">Хмелёва Виктория Сергеевна</option>
                    </select>
                </label>
                
                {}
                <Criterion
                        nameCriterion="Вовлеченность"
                        onChange={() =>{}}
                        value={1}
                />


                <input type="submit" className={classes['give-a-mark']} value="Оценить"/>
            </form>
        </div>
    );
}

export default AssessmentPage;