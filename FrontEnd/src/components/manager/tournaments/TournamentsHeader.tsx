export default function TournamentsHeader({userName} : {userName : string}) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                    Tournament Dashboard
                </h1>
                <p className="text-muted-foreground text-sm">
                    Welcome back, {userName}. Manage your leagues and track progress.
                </p>
            </div>
        </div>
    );
}