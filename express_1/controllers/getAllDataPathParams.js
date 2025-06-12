import { startups } from '../data/data.js';

export const getDataPathParams = (req, res) => {
    const {field, term} = req.params;
    const allowedFields = ['country', 'continent', 'industry'];
    
    if (!allowedFields.includes(field.toLowerCase())){
        return res.status(400).json({message:"Search field not allowed. Please use only 'country', 'continent' and 'industry'."})
    }

    const filteredData = startups.filter(startup => 
        startup[field].toLowerCase() === term.toLowerCase()
    )

    res.json(filteredData)
}