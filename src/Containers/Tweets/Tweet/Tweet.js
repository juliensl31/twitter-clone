// Librairie
import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../config/axios-firebase';
import routes from '../../../config/routes';
import classes from './Tweet.module.css';
import moment from 'moment';
import 'moment/locale/fr';
import { ShareSocial } from 'react-share-social';

import ShareModal from '../../../Components/UI/Modal/Share/ShareModal';
import ResponseModal from '../../../Components/UI/Modal/Response/ResponseModal';
import Follow from '../../../Components/Follow/Follow';
import Spinner from '../../../Components/UI/Spinner/Spinner';

function Tweet(props) {

    // State
    const [tweet, setTweet] = useState([]);
    const currentUser = props.user.displayName;
    const [responses, setResponses] = useState([]);
    const [chargement, setChargement] = useState(false);

    useEffect(() => {

        //Récupérer les tweets
        fetchTweets();

        return () => {
            console.log('useEffect (didUnmount)');
        }
    }, []);

    // ComponentDidMount
    const fetchTweets = () => {
        setChargement(true);
        axios.get('/tweets.json?orderBy="slug"&equalTo="' + props.match.params.slug + '"')
            .then(response => {

                if (Object.keys(response.data).length === 0) {
                    console.log(response);
                    toast.error("Cet tweet n'existe pas !");
                    props.history.push(routes.HOME);
                }

                for (let key in response.data) {
                    setTweet({
                        ...response.data[key],
                        id: key
                    });
                    setChargement(false);
                }
            })
            .catch(error => {
                console.log(error);
                setChargement(false);
            });

    }

    useEffect(() => {
        axios.get('/responses.json')
            .then(response => {

                const fetchedResponses = [];

                for (let key in response.data) {
                    fetchedResponses.push({
                        ...response.data[key],
                        id: key,
                    });
                }
                fetchedResponses.reverse();
                setResponses(fetchedResponses);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // ComponentDidUpdate
    useEffect(() => {
        document.title = tweet.titre;
    });

    // Fonctions
    const deleteClickedHandler = () => {

        props.user.getIdToken()
            .then(token => {
                axios.delete('/tweets/' + tweet.id + '.json?auth=' + token)
                    .then(response => {
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
            {chargement ? <><div className="container">Chargement...</div> <Spinner /></> :
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
                                Publié par : <Link to={routes.ACCOUNTS + '/' + tweet.auteur}><b>{tweet.auteur}</b></Link>
                                <span>
                                    {date}.
                                </span>
                            </div>
                            <div className={classes.icons}>

                                {tweet.auteur !== currentUser ? <Follow /> : null}

                                <ResponseModal />{responses.filter(response => response.tweet_id === props.match.params.slug).length}

                                <ShareModal>
                                    <ShareSocial
                                        className={classes.ShareSocial}
                                        url={"http://localhost:3000/TwitterClone/" + props.match.url}
                                        socialTypes={['facebook', 'twitter', 'whatsapp', 'reddit', 'linkedin', 'telegram']}
                                        onSocialButtonClicked={data => console.log(data)}
                                    />
                                </ShareModal>

                                {currentUser === tweet.auteur ?
                                    <>
                                        <svg onClick={deleteClickedHandler} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                                        </svg>
                                    </> 
                                : null}

                            </div>
                        </div>
                    </div>
                    <div className={classes.response}>
                        <h3>Réponses</h3>

                        {responses.map(response => (
                            <div key={response.id}>
                                {props.match.params.slug === response.tweet_id ?
                                    <div className={classes.GetResponse}>
                                        <p className={classes.content}>{response.contenu}</p>
                                        <div >
                                            <div className={classes.footer}>
                                                <div>Publié par : <Link to={routes.ACCOUNTS + '/' + response.auteur}><b>{response.auteur}</b></Link></div>
                                                <small>{moment(response.date).fromNow()}</small>
                                            </div>
                                        </div>
                                    </div>
                                    : null}
                            </div>
                        ))}
                    </div>
                </>
            }
        </>

    );
}

export default withRouter(Tweet);