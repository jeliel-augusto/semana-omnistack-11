const connection = require('../database/connection');
module.exports = {
    async index(req, res){
        const {page = 1, limit = 5} = req.query;
        const [count] = await connection('incidents')
            .count('id');
        res.header('X-Total-Count', count['count(`id`)']);
        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(limit)
            .orderBy('id')
            .offset((page - 1) * limit)
            .select([
                'incidents.*',
                'ongs.name', 'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);
        res.json(incidents);
    },
    async delete(req, res){
      const { id } = req.params;
      const ong_id = req.headers.authorization;
      const incident = await connection('incidents')
          .where('id', id)
          .select('ong_id')
          .first();
      if(incident.ong_id !== ong_id ){
          return res.status(401).json({error: 'Operation not permitted'});
      }
      await connection('incidents').where('id', id)
          .delete();
      return res.status(204).send();
    },
    async create(req, res){
        const { title, description, value } = req.body;
        const ong_id = req.headers.authorization;
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });
        return res.json({id});
    }
};
