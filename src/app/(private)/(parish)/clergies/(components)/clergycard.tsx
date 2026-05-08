interface ClergyCardProps {
name: string
role: string
fotoUrl: string

}



export default function  Clergycard(props: ClergyCardProps) {

    return (
        <div className="flex flex-col items-center">
            <img className="w-20 h-20 rounded-full object-cover" src={props.fotoUrl} alt={props.name}/>
            <p >{props.name}</p>
            <p>{props.role}</p>
        </div>
    )

}

