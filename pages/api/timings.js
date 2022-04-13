// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require('axios');

export default function handler(req, res) {

    try{
        let data = JSON.parse(req.body);

        axios.get(`https://api.aladhan.com/v1/calendar?latitude=${data.latitude}&longitude=${data.longitude}&method=9&month=${data.month + 1}&year=${data.year}`).then((res) => {
            let date = new Date().getDate();
            return res.data.data[date - 1].timings;
        }).then((data) => {
            res.status(200).json({ timings: data })
        })

    } catch(e){

        console.log(e);
        res.status(500).json({error: 'internal server error (data not fetched)'});

    }
}