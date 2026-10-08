import { bellekDepoKur } from './bellekDepo.ts'
import { depoSozlesmesi } from './depoSozlesmesi.ts'

depoSozlesmesi('bellekDepo', async () => bellekDepoKur())
