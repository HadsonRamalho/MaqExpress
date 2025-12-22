import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface MachineDropdownMenuProps {
    triggerColor: string;
}

export const MachineDropdownMenu: React.FC<MachineDropdownMenuProps> = ({ triggerColor }) => {
    return(
        <div>
        <DropdownMenu>
        <DropdownMenuTrigger>
        <p style={{color: triggerColor || "white"}}>Máquinas</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{zIndex: 1001}}>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Link href={"/machine"}>
                  <p style={{color: "black", fontSize: '15px'}}>Máquinas Disponíveis</p>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <Link href={"/create-machine"}>
                  <p style={{color: "black", fontSize: '15px'}}>Cadastrar Máquinas</p>
            </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
              <Link href={"/machine-list"}>
              <p style={{color: "black", fontSize: '15px'}}>Minhas Máquinas</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
        </DropdownMenuContent>
        </DropdownMenu>
        </div>
    );
}
