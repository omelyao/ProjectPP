import React, {useState} from 'react';
import classes from "../css/Form.module.css"
import AuthForm from './AuthForm';
import RegistrationForm from './RegistrationForm';
import { Modal } from '@mui/material';
import ResetForm from "./ResetForm";
import FormAuthHeader from "./FormAuthHeader";
import FormResetHeader from "./FormResetHeader";
import ResetFormSucceed from "./ResetFormSucceed";



function Form({onChange, form}) {

    const [isPasswordForgotten, setIsPasswordForgotten] = useState(false);
    const [isPasswordResetSucceed, setIsPasswordResetSucceed] = useState(false);

    const closeModal = () => {
        onChange(0);
        setIsPasswordForgotten(false);
        setIsPasswordResetSucceed(false);
    }

    if (form === 0)
    return<></>;

    return (
        <Modal  disableEnforceFocus  open={form !== 0} onClose={() => closeModal()}>

        <div className={classes["enter-form"]}>
            <div className={classes["head-form"]}>
                {isPasswordForgotten && <FormResetHeader/>}
                {!isPasswordForgotten && <FormAuthHeader onChange={onChange} form={form}/>}
                <img className={classes["cross"]} onClick={closeModal} src={require("../../../images/cross.svg").default} width="21.87" height="24" alt="крестик"/>
            </div>

            {form === 1 && !isPasswordForgotten && <AuthForm setIsPasswordForgotten={setIsPasswordForgotten}/>}
            {form === 2 && !isPasswordForgotten && <RegistrationForm onChange={onChange}/>}
            {isPasswordForgotten && !isPasswordResetSucceed && <ResetForm setIsPasswordResetSucceed={setIsPasswordResetSucceed}/>}
            {isPasswordResetSucceed && <ResetFormSucceed/>}
        </div>
    </Modal>
    );
}

export default Form;
