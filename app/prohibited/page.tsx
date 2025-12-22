"use client"

import { useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export function Prohibited() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/logado");
    }
  }, [user]);

  return(
    <div>
      <Alert
      variant={"destructive"}
      style={{
        width: "50%",
        height: "20vh",
        flexDirection: "column",
        display: "flex",
        flex: "2 0 auto",
        alignItems: "center",
        position: "relative",
        justifyContent: "center",
        marginTop: "10%",
        marginLeft: "22%"
        }}>
      <AlertCircleIcon className="h-6 w-6" />
      <AlertTitle>Atenção!</AlertTitle>
      <AlertDescription>
        <div>
          Você não tem acesso a essa página ainda. Entre na sua conta para ver o que temos aqui.
        </div>
        <div style={{
        flexDirection: "column",
        display: "flex",
        flex: "2 0 auto",
        alignItems: "center",
        position: "relative",
        justifyContent: "center",
        marginTop: "5%"
        }}>
          <Button onClick={()=> {router.push("/login")}}>Ir para o Login</Button>
        </div>
      </AlertDescription>
    </Alert>

    </div>
  );
}
