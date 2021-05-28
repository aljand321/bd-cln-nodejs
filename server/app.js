    //import http from 'http';
    import express from 'express';
    import morgan from 'morgan';
    import routes from './routes';

    /* const hostname = '127.0.0.1';
    const port = 3000;
     */ // setup express application
    const app = express()
    app.set('port', process.env.PORT || 3000)

    app.use(morgan('dev')); // log requests to the console

    // Parse incoming requests data
    app.use(express.json());
    app.use(express.urlencoded({extended:false}));

    routes(app);
    app.get('*', (req, res) => res.status(200).send({
      message: 'Welcome to the default API route',
    }));

    app.listen(app.get('port'), () => {
        console.log('Server on port', app.get('port'));
    })