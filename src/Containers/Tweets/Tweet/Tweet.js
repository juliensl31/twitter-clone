// Librairie
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../config/axios-firebase';
import routes from '../../../config/routes';
import classes from './Tweet.module.css';
import moment from 'moment';
import 'moment/locale/fr';
import {ShareSocial} from 'react-share-social';

import ShareModal from '../../../Components/UI/Modal/Share/ShareModal';
import ResponseModal from '../../../Components/UI/Modal/Response/ResponseModal';

function Tweet(props) {

    // State
    const [tweet, setTweet] = useState({});
    const currentUser = props.user.displayName;

    // ComponentDidMount
    useEffect(() => {
        axios.get('/tweets.json?orderBy="slug"&equalTo="'+ props.match.params.slug +'"')
        .then(response =>{

            if(Object.keys(response.data).length === 0) {
                console.log(response);
                toast.error("Cet tweet n'existe pas !");
                props.history.push(routes.HOME);
            }
         
            for (let key in response.data) {
                setTweet({
                    ...response.data[key],
                    id: key
                });
            }
        })
        .catch(error => {
            console.log(error);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        document.title = tweet.titre;
    });

    // Fonctions
    const deleteClickedHandler = () => {

        props.user.getIdToken()
        .then(token => {
            axios.delete('/tweets/' + tweet.id + '.json?auth=' + token)
                .then(response =>{
                    toast('Tweet supprimé avec succès.');
                    props.history.push(routes.TWEETS);
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log(error);
        });
    }

    // Variable
    moment.locale('fr');
    let date = moment.unix(tweet.date / 1000).calendar();

    return (
        <>
            <div className={[classes.Tweet, 'container'].join(' ')}>
                <h2>{tweet.titre}</h2>
                <div className={classes.section}>
                    <div className={classes.content}>
                    {tweet.contenu} 
                    </div>
                </div>
                <div className={classes.footer}>
                    <div>
                    <b>{tweet.auteur}</b>
                        <span>
                            Publié {date}.
                        </span> 
                    </div>
                    <div className={classes.icons}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                            <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        </svg> */}
                        <ResponseModal>
                            
                        </ResponseModal>
                        <ShareModal>
                            <ShareSocial 
                                className={classes.ShareSocial} 
                                url = {"http://localhost:3000/TwitterClone/" + props.match.url}
                                socialTypes= {['facebook','twitter', 'whatsapp', 'reddit', 'linkedin', 'telegram']}
                                onSocialButtonClicked={ data => console.log(data)}    
                            />
                        </ShareModal>
                        {props.user.displayName === tweet.auteur ? 
                        <>
                            <svg onClick={deleteClickedHandler} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                            </svg> 
                        </> : null }
                    </div> 
                    
                </div>
            </div>
            <div>
            </div>

        </>
        
    );
}

export default withRouter(Tweet);