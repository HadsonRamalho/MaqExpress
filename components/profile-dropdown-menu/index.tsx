import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation";
import Link from "next/link";


export const ProfileDropdownMenu = () => {
    const { signOut } = useAuth();
    const router = useRouter();
    const LogOut = () => {
        signOut();
        localStorage.removeItem("PROFILE_IMAGE_URL");
        localStorage.removeItem("USER_ID");
        localStorage.removeItem("cidade_dropdownmenu");
        router.push("/login");
    };

    return(
        <div>
        <DropdownMenu>
        <DropdownMenuTrigger>
        <Avatar className="border-[hsl(var(--primary))] border-[2px]">
                <AvatarImage src={localStorage.getItem("PROFILE_IMAGE_URL") || "https://i.pinimg.com/736x/f1/13/b7/f113b7eb12a6e28b201152535c8b89da.jpg"} />
        </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{zIndex: 1001}}>
            <DropdownMenuLabel className="flex items-center justify-center">
                <Avatar className="border-[hsl(var(--primary))] border-[2px]">
                <AvatarImage src={localStorage.getItem("PROFILE_IMAGE_URL") || "https://i.pinimg.com/736x/f1/13/b7/f113b7eb12a6e28b201152535c8b89da.jpg"} />
                </Avatar>

            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Link href={"/user-profile"} >
                  <p style={{color: "black", fontSize: '15px'}}>Configuração da Conta</p>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Link href={"/contract-request"}>
                    <p style={{color: "black", fontSize: '15px'}}>Solicitações de Contratos</p>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
            <Link href={"/notification-list"}>
                    <p style={{color: "black", fontSize: '15px'}}>Notificações</p>
            </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuLabel>
                <strong>Suporte</strong>
            </DropdownMenuLabel>

            <DropdownMenuItem>
            <Link href={"/helpcenter"} >
            <p style={{color: "black", fontSize: '15px'}}>Central de Ajuda</p>
            </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={LogOut}>
                <p style={{color: "black"}}>Sair da conta</p>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        </div>
    );
}
