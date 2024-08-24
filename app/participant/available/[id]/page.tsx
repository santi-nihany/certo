export default function Home({ params}) { 
    const { id } = params;
    return (
        <div className="bg-blue">
            <h1 className="text-light">Encuesta {id}</h1>
        </div>
    )
}

