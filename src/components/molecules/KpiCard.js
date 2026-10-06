import { Card } from 'react-bootstrap';

export default function KpiCard({titulo,valor}){
  return <Card className="kpi"><Card.Body><Card.Title>{titulo}</Card.Title><div className="kpi-number">{valor}</div></Card.Body></Card>;
}
