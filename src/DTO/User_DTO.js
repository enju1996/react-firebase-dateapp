import React from 'react';

export default class User_DTO extends React.Component {
    constructor(props){
        super(props)
        this._Board_Key;
        this._email;
        this._partner_userid;
        this._profile_picture;
        this._profile_text;
        this._username;
    }

    get Board_Key(){ return this._Board_Key;}

    get email(){ return this._email;}

    get partner_userid(){ return this._partner_userid;}

    get profile_picture(){ return this._profile_picture;}

    get profile_text(){return this._profile_text; }

    get username(){ return this._username; }

    set Board_Key(data){this._Board_Key=data; }

    set email(data){this._email=data; }
    
    set partner_userid(data){this._partner_userid=data; }
    
    set profile_picture(data){this._profile_picture=data; }
    
    set profile_text(data){this._profile_text=data; }
    
    set username(data){this._username=data; }
}