"use client"

import "./navbar.css";
import maq from "@/assets/maq.png";
import { ModeToggle } from "../mode-toggle/mode-toggle";
import { useEffect, useState } from "react";
import { ProfileDropdownMenu } from "../profile-dropdown-menu";
import { DropdownMenuDemo } from "../dropdown-menu";
import { MachineDropdownMenu } from "../machine-dropdown-menu";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export function NavBar() {
  const [logged, setLogged] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("USER_ID");
    if (id) {
      setLogged(true);
      return;
    }
  }, []);

  return (
    <nav className="bg-primary text-white">
      <ul className="nav-left">
        <li>
          <Link
            href="/"
          >
            <img
              className="imagem"
              src={maq.src}
              alt=""
              style={{ width: "100%", height: "100%" }}
            />
          </Link>
        </li>

        <li>
          <Link
            href="/"

          >
            Pagina Inicial
          </Link>
        </li>

        <li>
          <Link
            href="/howworks"

          >
            Como Funciona
          </Link>
        </li>
        <li className=" hidden sm:flex">
          {logged ? (
            <MachineDropdownMenu
              triggerColor={"hsl(var(--text))"}
            ></MachineDropdownMenu>
          ) : (
            <Link
              href="/machine"

            >
              Máquinas
            </Link>
          )}
        </li>
        <li>
          <Link
            href="/about"

          >
            Sobre Nós
          </Link>
        </li>
      </ul>
      {menuOpen && (
        <ul
          style={{ zIndex: 1000 }}
          className="sm:hidden absolute top-0 left-0 w-full h-[60svh] bg-[hsl(var(--machine-card-bg))] text-red flex flex-col items-center justify-center space-y-6 text-lg"
        >
          <li>
            <Link
              href="/"
              className="class1"
              onClick={() => setMenuOpen(false)}
            >
              <p className="text-[hsl(var(--text))]">Início</p>
            </Link>
          </li>
          <li>
            <Link
              href="/howworks"
              className="class1"
              onClick={() => setMenuOpen(false)}
            >
              <p className="text-[hsl(var(--text))]">Como Funciona</p>
            </Link>
          </li>
          <li>
            {logged ? (
              <MachineDropdownMenu triggerColor="hsl(var(--text))" />
            ) : (
              <Link
                href="/machine"
                className="class1"
                onClick={() => setMenuOpen(false)}
              >
                <p className="text-[hsl(var(--text))]">Máquinas</p>
              </Link>
            )}
          </li>
          <li>
            <Link
              href="/about"
              className="class1"
              onClick={() => setMenuOpen(false)}
            >
              <p className="text-[hsl(var(--text))]">Sobre</p>
            </Link>
          </li>
          <li>
            <DropdownMenuDemo triggerColor="hsl(var(--text))" />
          </li>
          <li>
            {logged ? (
              <ProfileDropdownMenu />
            ) : (
              <Link
                href="/login"
                className="class1"
                onClick={() => setMenuOpen(false)}
              >
                <p className="text-[hsl(var(--text))]">Entrar</p>
              </Link>
            )}
          </li>
          <li>
            <ModeToggle />
          </li>
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setMenuOpen(false)}
          >
            <p className="text-[hsl(var(--text))]">✖</p>
          </button>
        </ul>
      )}

      <ul className="nav-right">
        <li className="class1  hidden sm:flex ">
          <DropdownMenuDemo
            triggerColor={"hsl(var(--text))"}
          ></DropdownMenuDemo>
        </li>

        <li className=" hidden sm:flex">
          {logged ? (
            <ProfileDropdownMenu></ProfileDropdownMenu>
          ) : (
            <Link
              href="/login"
            >
              <div>
                Entrar
              </div>
            </Link>
          )}
        </li>

        <li className=" hidden sm:flex">
          <ModeToggle></ModeToggle>
        </li>

        <li className="flex sm:hidden">
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          >
            <MenuIcon color="white" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
