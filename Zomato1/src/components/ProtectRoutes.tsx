import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type ProtectRoutesProps = {
    isLoggedIn: boolean;
    children: ReactNode;
}

function ProtectRoutes({ isLoggedIn, children }: ProtectRoutesProps) {
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

export default ProtectRoutes;
