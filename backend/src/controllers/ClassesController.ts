import { Request, Response } from 'express';

import db from '../database/connections';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(req: Request, res:Response) {
    const filters = req.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    if(!filters.subject || !filters.subject || !filters.time) {
      return res.status(400).json({
        error: 'Missing filters to search classes'
      });
    }

    const timeInMinutes = convertHourToMinutes(time);

    const classes = await db('classes')
      .whereExists(function() {
        // criar uma query para a tabela schedule verificando se existe um horário disponível
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`. `class_id` = `classes`.`id`')
          // ?? -> cada parâmetro dentro dessa whereRaw
          // ?? -> valor passado pelo cliente que irá comparar que os valores já determinados no banco de dados (pelo provider, admin, prestador de serviço etc...)
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])

      })
      .where('classes.subject', '=', subject)
      // user_id na tabela classes = id na tabela users
      .join('users', 'classes.user_id', '=', 'users.id')
      // selecionar todos os dados da tabela classes e todos os dados da tabela users
      .select(['classes.*', 'users.*']);

    return res.json(classes);
  }

  async create(req: Request, res: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = req.body;
  
    // transaction -> Seve para fazer todas as operações do banco ao mesmo tempo e, se uma delas falhar, desfaz todas que já foram feitas nesse mesmo contexto  
    const trx = await db.transaction();
  
    try {
      const insertedUsersIds = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
    
      const user_id = insertedUsersIds[0];
    
      const insertedClassesId = await trx('classes').insert({
        subject,
        cost,
        user_id
      });
    
      const class_id = insertedClassesId[0];
    
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });
    
      await trx('class_schedule').insert(classSchedule);
    
      // Somente aqui que o transaction efetua todas as commits do banco
      await trx.commit();
    
      return res.status(201).send();
  
    } catch (err) {
  
      // Desfaz qualquer alteração que tenha sido feita no banco nesse meio tempo
      await trx.rollback();
  
      console.log(err);
      return res.status(400).json({
        error : 'Unexpected error while creating new class '
      });
    }
  }
}